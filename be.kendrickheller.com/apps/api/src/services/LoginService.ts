import { prisma } from '@kendrickheller/core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class LoginService {
    private static JWT_SECRET = process.env.JWT_SECRET || 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=';
    private static REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

    public static async login(data: any) {
        const { loginName, password, fbAccessToken, googleAccessToken, appleAccessToken } = data;
        let user: any = null;

        if (googleAccessToken) {
            try {
                const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleAccessToken}`);
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                const googleUser = await response.json();
                const email = googleUser.email;
                const googleId = googleUser.sub || googleUser.id;

                user = await prisma.user.findFirst({
                    where: { email: email, deleteFlg: 0 }
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            loginName: email,
                            email: email,
                            googleId: String(googleId),
                            fullName: googleUser.name,
                            avataUrl: googleUser.picture,
                            password: ''
                        }
                    });
                } else {
                    await prisma.user.update({
                        where: { userId: user.userId },
                        data: { googleId: String(googleId) }
                    });
                }
            } catch (err: any) {
                throw new Error('Failed to validate Google token: ' + err.message);
            }
        } else if (loginName && password) {
            user = await prisma.user.findFirst({
                where: { loginName, deleteFlg: 0 }
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (user.password) {
                let isValid = false;
                if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                    isValid = await bcrypt.compare(password, user.password);
                } else {
                    const legacyHash = crypto.createHash('sha256').update(password, 'utf8').digest('base64');
                    isValid = (legacyHash === user.password);
                }

                if (!isValid) {
                    throw new Error('Invalid password');
                }
            } else {
                throw new Error('User does not have a password configured');
            }
        } else {
            throw new Error('Invalid login parameters. Provide either googleAccessToken or loginName/password. Payload: ' + JSON.stringify(data));
        }

        const userRoles = await prisma.userRole.findMany({
            where: { userId: Number(user.userId) }
        });
        const roleIds = userRoles.map((ur: any) => ur.roleId);
        let roleNames: string[] = [];
        if (roleIds.length > 0) {
            const roles = await prisma.role.findMany({
                where: { roleId: { in: roleIds } }
            });
            roleNames = roles.map((r: any) => r.roleName as string);
        }
        if (user.loginName === 'admin' && !roleNames.includes('ADMIN')) {
            roleNames.push('ADMIN');
        }

        const token = jwt.sign(
            { 
                userId: Number(user.userId), 
                loginName: user.loginName,
                email: user.email,
                fullName: user.fullName,
                avataUrl: user.avataUrl,
                facebookId: user.facebookId,
                googleId: user.googleId,
                roles: JSON.stringify(roleNames)
            },
            this.JWT_SECRET,
            { 
                expiresIn: '7d',
                audience: user.loginName,
                subject: user.fullName || user.loginName,
                jwtid: String(user.userId)
            }
        );

        const refreshToken = jwt.sign(
            { userId: Number(user.userId), loginName: user.loginName },
            this.REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        const existingSession = await prisma.sessionInfo.findFirst({
            where: { userId: Number(user.userId), deleteFlg: 0 }
        });

        if (existingSession) {
            await prisma.sessionInfo.update({
                where: { sessionInfoId: existingSession.sessionInfoId },
                data: { refreshToken }
            });
        } else {
            await prisma.sessionInfo.create({
                data: {
                    userId: Number(user.userId),
                    loginName: user.loginName,
                    refreshToken,
                    createdBy: user.loginName
                }
            });
        }

        return { token, refreshToken };
    }

    public static async renewToken(refreshToken: string) {
        try {
            const decoded: any = jwt.verify(refreshToken, this.REFRESH_SECRET);
            
            const session = await prisma.sessionInfo.findFirst({
                where: { refreshToken, deleteFlg: 0 }
            });

            if (!session) {
                throw new Error('Invalid refresh token session');
            }

            const user = await prisma.user.findFirst({
                where: { userId: Number(decoded.userId), deleteFlg: 0 }
            });

            if (!user) {
                throw new Error('User not found');
            }

            const userRoles = await prisma.userRole.findMany({
                where: { userId: Number(user.userId) }
            });
            const roleIds = userRoles.map((ur: any) => ur.roleId);
            let roleNames: string[] = [];
            if (roleIds.length > 0) {
                const roles = await prisma.role.findMany({
                    where: { roleId: { in: roleIds } }
                });
                roleNames = roles.map((r: any) => r.roleName as string);
            }
            if (user.loginName === 'admin' && !roleNames.includes('ADMIN')) {
                roleNames.push('ADMIN');
            }

            const newToken = jwt.sign(
            { 
                userId: Number(user.userId), 
                loginName: user.loginName,
                email: user.email,
                fullName: user.fullName,
                avataUrl: user.avataUrl,
                facebookId: user.facebookId,
                googleId: user.googleId,
                roles: JSON.stringify(roleNames) 
            },
            this.JWT_SECRET,
            { 
                expiresIn: '7d',
                audience: user.loginName,
                subject: user.fullName || user.loginName,
                jwtid: String(user.userId)
            }
            );

            const newRefreshToken = jwt.sign(
                { userId: user.userId, loginName: user.loginName },
                this.REFRESH_SECRET,
                { expiresIn: '30d' }
            );

            await prisma.sessionInfo.update({
                where: { sessionInfoId: session.sessionInfoId },
                data: { refreshToken: newRefreshToken }
            });

            return { token: newToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    public static async signout(refreshToken: string) {
        if (!refreshToken) return;
        const session = await prisma.sessionInfo.findFirst({
            where: { refreshToken, deleteFlg: 0 }
        });
        if (session) {
            await prisma.sessionInfo.delete({
                where: { sessionInfoId: session.sessionInfoId }
            });
        }
    }
}
