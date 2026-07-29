import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as swaggerDocument from '../swagger.json';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

import { LoginController } from './controllers/LoginController';
import { authMiddleware } from './middlewares/authMiddleware';
import { requireRole } from './middlewares/requirePermission';
import { uploadMiddleware } from './middlewares/uploadMiddleware';
import { idmRouter } from './routes/idmRoutes';
import { TrackingController } from './controllers/TrackingController';
import { CommonInformationController } from './controllers/CommonInformationController';
import { ProductRealmController } from './controllers/ProductRealmController';
import { ProductCategoryController } from './controllers/ProductCategoryController';
import { ProductController } from './controllers/ProductController';
import { ProductSerialController } from './controllers/ProductSerialController';
import { AccountBalanceController } from './controllers/AccountBalanceController';
import { AccountHistoryController } from './controllers/AccountHistoryController';
import { AdvertisingBannerController } from './controllers/AdvertisingBannerController';
import { AudioBookController } from './controllers/AudioBookController';
import { AudioBookSeriesController } from './controllers/AudioBookSeriesController';
import { AudioChapterController } from './controllers/AudioChapterController';
import { OrderController } from './controllers/OrderController';
import { FileController } from './controllers/FileController';
import { BannerController } from './controllers/BannerController';
import { CompanyImageController } from './controllers/CompanyImageController';
import { CompanyInfoController } from './controllers/CompanyInfoController';
import { CountryController } from './controllers/CountryController';
import { CustomerTypeController } from './controllers/CustomerTypeController';
import { EmailController } from './controllers/EmailController';
import { EmailTemplateController } from './controllers/EmailTemplateController';
import { GuidePageController } from './controllers/GuidePageController';
import { InventoryController } from './controllers/InventoryController';
import { LogoController } from './controllers/LogoController';
import { NewsController } from './controllers/NewsController';
import { NoteController } from './controllers/NoteController';
import { NotificationController } from './controllers/NotificationController';
import { NotificationTemplateController } from './controllers/NotificationTemplateController';
import { OrderRequirementController } from './controllers/OrderRequirementController';
import { ParameterController } from './controllers/ParameterController';
import { PrintedTemplateController } from './controllers/PrintedTemplateController';
import { PurchaseAccountController } from './controllers/PurchaseAccountController';
import { QRCodeController } from './controllers/QRCodeController';
import { QuestionController } from './controllers/QuestionController';
import { ReceiverInfoController } from './controllers/ReceiverInfoController';
import { ServiceController } from './controllers/ServiceController';
import { StaticPageController } from './controllers/StaticPageController';
import { TranslationController } from './controllers/TranslationController';
import { UserCustomerTypeController } from './controllers/UserCustomerTypeController';

export const app = express();
app.use(cors());

// Strip trailing semicolon from content-type to fix frontend useFetch bug
app.use((req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].endsWith(';')) {
        req.headers['content-type'] = req.headers['content-type'].slice(0, -1);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// IDM / Security Routes
const securityRouter = express.Router();
securityRouter.post('/login', LoginController.login);
securityRouter.post('/renew-token', LoginController.renewToken);
securityRouter.post('/signout', LoginController.signout);

// Example of a protected route
securityRouter.get('/me', authMiddleware, (req: any, res) => {
    res.json(req.user);
});

// Example of an admin route
securityRouter.get('/admin', authMiddleware, requireRole(['ADMIN']), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

app.use('/pgidm/rest-api/security', securityRouter);
app.use('/pgidm/rest-api', idmRouter);

// PGCORE Routes
const pgcoreRouter = express.Router();

// Product Realm
pgcoreRouter.get('/product-realm', ProductRealmController.getAllRealms);
pgcoreRouter.get('/product-realm/:id', ProductRealmController.getRealmById);
pgcoreRouter.post('/product-realm', authMiddleware, requireRole(['ADMIN']), ProductRealmController.createRealm);
pgcoreRouter.put('/product-realm/:id', authMiddleware, requireRole(['ADMIN']), ProductRealmController.updateRealm);
pgcoreRouter.delete('/product-realm/:id', authMiddleware, requireRole(['ADMIN']), ProductRealmController.deleteRealm);

// Product Category
pgcoreRouter.get('/product-category', ProductCategoryController.getAllCategories);
pgcoreRouter.get('/product-category/attribute', ProductCategoryController.getAttributes);
pgcoreRouter.post('/product-category/config', ProductCategoryController.getCategoryAttributesByIds);
pgcoreRouter.get('/product-category/:id/config', ProductCategoryController.getCategoryDisplayOption);
pgcoreRouter.put('/product-category/:id/config', authMiddleware, requireRole(['ADMIN']), ProductCategoryController.updateCategoryDisplayOption);
pgcoreRouter.post('/product-category/avatar/:id', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), ProductCategoryController.uploadAvatar);
pgcoreRouter.get('/product-category/:id', ProductCategoryController.getCategoryById);
pgcoreRouter.post('/product-category', authMiddleware, requireRole(['ADMIN']), ProductCategoryController.createCategory);
pgcoreRouter.put('/product-category/:id', authMiddleware, requireRole(['ADMIN']), ProductCategoryController.updateCategory);
pgcoreRouter.delete('/product-category/:id', authMiddleware, requireRole(['ADMIN']), ProductCategoryController.deleteCategory);

// Product
pgcoreRouter.get('/product', ProductController.getProducts);
pgcoreRouter.post('/product/ids', ProductController.getProductsByIds);
pgcoreRouter.get('/product/:id', ProductController.getProductById);
pgcoreRouter.post('/product', authMiddleware, requireRole(['ADMIN']), ProductController.createProduct);
pgcoreRouter.put('/product/:id', authMiddleware, requireRole(['ADMIN']), ProductController.updateProduct);
pgcoreRouter.delete('/product/:id', authMiddleware, requireRole(['ADMIN']), ProductController.deleteProduct);
pgcoreRouter.post('/product/avatar/:id', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), ProductController.uploadAvatar);
pgcoreRouter.post('/product/image/:id', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), ProductController.addImage);
pgcoreRouter.post('/product/image-from-library/:id', authMiddleware, requireRole(['ADMIN']), ProductController.addImageFromLibrary);
pgcoreRouter.delete('/product/:id/image/:fileId', authMiddleware, requireRole(['ADMIN']), ProductController.deleteImage);

// ProductSerial
pgcoreRouter.get('/product-serial', ProductSerialController.getProductSerials);
pgcoreRouter.get('/product-serial/file/export', ProductSerialController.export);
pgcoreRouter.get('/product-serial/file/import-template', ProductSerialController.exportTemplate);
pgcoreRouter.post('/product-serial/import', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), ProductSerialController.importExcel);
pgcoreRouter.post('/product-serial/avatar/:id', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), ProductSerialController.uploadAvatar);
pgcoreRouter.post('/product-serial/image/:id', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), ProductSerialController.addImage);
pgcoreRouter.delete('/product-serial/:id/image/:fileId', authMiddleware, requireRole(['ADMIN']), ProductSerialController.deleteImage);
pgcoreRouter.get('/product-serial/product/:id', ProductSerialController.getProductSerialsByProduct);
pgcoreRouter.get('/product-serial/me', authMiddleware, ProductSerialController.getMyProductSerials);
pgcoreRouter.get('/product-serial/:id', ProductSerialController.getProductSerial);
pgcoreRouter.post('/product-serial', authMiddleware, requireRole(['ADMIN']), ProductSerialController.createProductSerial);
pgcoreRouter.put('/product-serial/:id', authMiddleware, requireRole(['ADMIN']), ProductSerialController.updateProductSerial);
pgcoreRouter.put('/product-serial/:id/sell', authMiddleware, requireRole(['ADMIN']), ProductSerialController.sellProductSerial);
pgcoreRouter.delete('/product-serial/:id', authMiddleware, requireRole(['ADMIN']), ProductSerialController.deleteProductSerial);

// AccountBalance
pgcoreRouter.get('/account-balance', AccountBalanceController.getAll);
pgcoreRouter.get('/account-balance/:id', AccountBalanceController.getById);
pgcoreRouter.post('/account-balance', authMiddleware, requireRole(['ADMIN']), AccountBalanceController.create);
pgcoreRouter.put('/account-balance/:id', authMiddleware, requireRole(['ADMIN']), AccountBalanceController.update);
pgcoreRouter.delete('/account-balance/:id', authMiddleware, requireRole(['ADMIN']), AccountBalanceController.delete);

// AccountHistory
pgcoreRouter.get('/account-history', AccountHistoryController.getAll);
pgcoreRouter.get('/account-history/:id', AccountHistoryController.getById);
pgcoreRouter.post('/account-history', authMiddleware, requireRole(['ADMIN']), AccountHistoryController.create);
pgcoreRouter.put('/account-history/:id', authMiddleware, requireRole(['ADMIN']), AccountHistoryController.update);
pgcoreRouter.delete('/account-history/:id', authMiddleware, requireRole(['ADMIN']), AccountHistoryController.delete);

// AdvertisingBanner
pgcoreRouter.get('/advertising-banner', AdvertisingBannerController.getAdvertisingBanners);
pgcoreRouter.get('/advertising-banner/:id', AdvertisingBannerController.getAdvertisingBannerById);
pgcoreRouter.delete('/advertising-banner/:id', authMiddleware, requireRole(['ADMIN']), AdvertisingBannerController.deleteAdvertisingBanner);

// AudioBook
pgcoreRouter.get('/audio-book', AudioBookController.getAudioBooks);
pgcoreRouter.get('/audio-book/:id', AudioBookController.getAudioBookById);
pgcoreRouter.post('/audio-book', authMiddleware, requireRole(['ADMIN']), AudioBookController.createAudioBook);
pgcoreRouter.put('/audio-book/:id', authMiddleware, requireRole(['ADMIN']), AudioBookController.updateAudioBook);
pgcoreRouter.delete('/audio-book/:id', authMiddleware, requireRole(['ADMIN']), AudioBookController.deleteAudioBook);

// AudioBookSeries
pgcoreRouter.get('/audio-book-series', AudioBookSeriesController.getAudioBookSeries);
pgcoreRouter.get('/audio-book-series/:id', AudioBookSeriesController.getAudioBookSeriesById);
pgcoreRouter.post('/audio-book-series', authMiddleware, requireRole(['ADMIN']), AudioBookSeriesController.createAudioBookSeries);
pgcoreRouter.put('/audio-book-series/:id', authMiddleware, requireRole(['ADMIN']), AudioBookSeriesController.updateAudioBookSeries);
pgcoreRouter.delete('/audio-book-series/:id', authMiddleware, requireRole(['ADMIN']), AudioBookSeriesController.deleteAudioBookSeries);

// AudioChapter
pgcoreRouter.get('/audio-chapter', AudioChapterController.getAudioChapters);
pgcoreRouter.get('/audio-chapter/:id', AudioChapterController.getAudioChapterById);
pgcoreRouter.post('/audio-chapter', authMiddleware, requireRole(['ADMIN']), AudioChapterController.createAudioChapter);
pgcoreRouter.put('/audio-chapter/:id', authMiddleware, requireRole(['ADMIN']), AudioChapterController.updateAudioChapter);
pgcoreRouter.delete('/audio-chapter/:id', authMiddleware, requireRole(['ADMIN']), AudioChapterController.deleteAudioChapter);

// Banner
pgcoreRouter.get('/banner', BannerController.getBanners);
pgcoreRouter.get('/banner/:id', BannerController.getBannerById);
pgcoreRouter.post('/banner', authMiddleware, requireRole(['ADMIN']), BannerController.createBanner);
pgcoreRouter.put('/banner/:id', authMiddleware, requireRole(['ADMIN']), BannerController.updateBanner);
pgcoreRouter.delete('/banner/:id', authMiddleware, requireRole(['ADMIN']), BannerController.deleteBanner);

// CompanyImage
pgcoreRouter.get('/company-image', CompanyImageController.getCompanyImages);
pgcoreRouter.get('/company-image/:id', CompanyImageController.getCompanyImageById);
pgcoreRouter.post('/company-image', authMiddleware, requireRole(['ADMIN']), CompanyImageController.createCompanyImage);
pgcoreRouter.put('/company-image/:id', authMiddleware, requireRole(['ADMIN']), CompanyImageController.updateCompanyImage);
pgcoreRouter.delete('/company-image/:id', authMiddleware, requireRole(['ADMIN']), CompanyImageController.deleteCompanyImage);

// CompanyInfo
pgcoreRouter.get('/company-info', CompanyInfoController.getCompanyInfos);
pgcoreRouter.get('/company-info/key/:key', CompanyInfoController.getCompanyInfoByKey);
pgcoreRouter.get('/company-info/:id', CompanyInfoController.getCompanyInfoById);
pgcoreRouter.post('/company-info', authMiddleware, requireRole(['ADMIN']), CompanyInfoController.createCompanyInfo);
pgcoreRouter.put('/company-info/:id', authMiddleware, requireRole(['ADMIN']), CompanyInfoController.updateCompanyInfo);
pgcoreRouter.delete('/company-info/:id', authMiddleware, requireRole(['ADMIN']), CompanyInfoController.deleteCompanyInfo);

// Country
pgcoreRouter.get('/country', CountryController.getCountries);
pgcoreRouter.get('/country/:id', CountryController.getCountryById);
pgcoreRouter.post('/country', authMiddleware, requireRole(['ADMIN']), CountryController.createCountry);
pgcoreRouter.put('/country/:id', authMiddleware, requireRole(['ADMIN']), CountryController.updateCountry);
pgcoreRouter.delete('/country/:id', authMiddleware, requireRole(['ADMIN']), CountryController.deleteCountry);

// CustomerType
pgcoreRouter.get('/customer-type', CustomerTypeController.getCustomerTypes);
pgcoreRouter.get('/customer-type/:id', CustomerTypeController.getCustomerTypeById);
pgcoreRouter.post('/customer-type', authMiddleware, requireRole(['ADMIN']), CustomerTypeController.createCustomerType);
pgcoreRouter.put('/customer-type/:id', authMiddleware, requireRole(['ADMIN']), CustomerTypeController.updateCustomerType);
pgcoreRouter.delete('/customer-type/:id', authMiddleware, requireRole(['ADMIN']), CustomerTypeController.deleteCustomerType);

// Email
pgcoreRouter.get('/email', EmailController.getEmails);
pgcoreRouter.get('/email/:id', EmailController.getEmailById);
pgcoreRouter.post('/email', authMiddleware, requireRole(['ADMIN']), EmailController.createEmail);
pgcoreRouter.put('/email/:id', authMiddleware, requireRole(['ADMIN']), EmailController.updateEmail);
pgcoreRouter.delete('/email/:id', authMiddleware, requireRole(['ADMIN']), EmailController.deleteEmail);

// EmailTemplate
pgcoreRouter.get('/email-template', EmailTemplateController.getEmailTemplates);
pgcoreRouter.get('/email-template/:id', EmailTemplateController.getEmailTemplateById);
pgcoreRouter.post('/email-template', authMiddleware, requireRole(['ADMIN']), EmailTemplateController.createEmailTemplate);
pgcoreRouter.put('/email-template/:id', authMiddleware, requireRole(['ADMIN']), EmailTemplateController.updateEmailTemplate);
pgcoreRouter.delete('/email-template/:id', authMiddleware, requireRole(['ADMIN']), EmailTemplateController.deleteEmailTemplate);

// GuidePage
pgcoreRouter.get('/guide-page', GuidePageController.getGuidePages);
pgcoreRouter.get('/guide-page/:id', GuidePageController.getGuidePageById);
pgcoreRouter.post('/guide-page', authMiddleware, requireRole(['ADMIN']), GuidePageController.createGuidePage);
pgcoreRouter.put('/guide-page/:id', authMiddleware, requireRole(['ADMIN']), GuidePageController.updateGuidePage);
pgcoreRouter.delete('/guide-page/:id', authMiddleware, requireRole(['ADMIN']), GuidePageController.deleteGuidePage);

// Inventory
pgcoreRouter.get('/inventory', InventoryController.getInventories);
pgcoreRouter.get('/inventory/:id', InventoryController.getInventoryById);
pgcoreRouter.post('/inventory', authMiddleware, requireRole(['ADMIN']), InventoryController.createInventory);
pgcoreRouter.put('/inventory/:id', authMiddleware, requireRole(['ADMIN']), InventoryController.updateInventory);
pgcoreRouter.delete('/inventory/:id', authMiddleware, requireRole(['ADMIN']), InventoryController.deleteInventory);

// Logo
pgcoreRouter.get('/logo', LogoController.getLogos);
pgcoreRouter.get('/logo/final', LogoController.getFinalLogo);
pgcoreRouter.get('/logo/:id', LogoController.getLogoById);
pgcoreRouter.post('/logo', authMiddleware, requireRole(['ADMIN']), LogoController.createLogo);
pgcoreRouter.put('/logo/:id', authMiddleware, requireRole(['ADMIN']), LogoController.updateLogo);
pgcoreRouter.delete('/logo/:id', authMiddleware, requireRole(['ADMIN']), LogoController.deleteLogo);

// News
pgcoreRouter.get('/news', NewsController.getNews);
pgcoreRouter.post('/news/image', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), NewsController.uploadImage);
pgcoreRouter.delete('/news/image/:fileId', authMiddleware, requireRole(['ADMIN']), NewsController.deleteImage);
pgcoreRouter.get('/news/:newsId/comment', NewsController.getComments);
pgcoreRouter.get('/news/parent/:commentId/comment', NewsController.getChildComments);
pgcoreRouter.post('/news/comment', authMiddleware, NewsController.createComment);
pgcoreRouter.get('/news/:id', NewsController.getNewsById);
pgcoreRouter.post('/news', authMiddleware, requireRole(['ADMIN']), NewsController.createNews);
pgcoreRouter.put('/news/:id', authMiddleware, requireRole(['ADMIN']), NewsController.updateNews);
pgcoreRouter.delete('/news/:id', authMiddleware, requireRole(['ADMIN']), NewsController.deleteNews);

// Note
pgcoreRouter.get('/note', NoteController.getNotes);
pgcoreRouter.get('/note/:id', NoteController.getNoteById);
pgcoreRouter.post('/note', authMiddleware, requireRole(['ADMIN']), NoteController.createNote);
pgcoreRouter.put('/note/:id', authMiddleware, requireRole(['ADMIN']), NoteController.updateNote);
pgcoreRouter.delete('/note/:id', authMiddleware, requireRole(['ADMIN']), NoteController.deleteNote);

// Notification
pgcoreRouter.get('/notification', NotificationController.getNotifications);
pgcoreRouter.get('/notification/badge/me', authMiddleware, NotificationController.getBadge);
pgcoreRouter.get('/notification/me', authMiddleware, NotificationController.getMyNotifications);
pgcoreRouter.put('/notification/seen', authMiddleware, NotificationController.markSeen);
pgcoreRouter.put('/notification/read/all', authMiddleware, NotificationController.markReadAll);
pgcoreRouter.put('/notification/read/:id', authMiddleware, NotificationController.markRead);
pgcoreRouter.get('/notification/:id', NotificationController.getNotificationById);
pgcoreRouter.post('/notification', authMiddleware, requireRole(['ADMIN']), NotificationController.createNotification);
pgcoreRouter.put('/notification/:id', authMiddleware, requireRole(['ADMIN']), NotificationController.updateNotification);
pgcoreRouter.delete('/notification/:id', authMiddleware, requireRole(['ADMIN']), NotificationController.deleteNotification);

// NotificationTemplate
pgcoreRouter.get('/notification-template', NotificationTemplateController.getNotificationTemplates);
pgcoreRouter.get('/notification-template/:id', NotificationTemplateController.getNotificationTemplateById);
pgcoreRouter.post('/notification-template', authMiddleware, requireRole(['ADMIN']), NotificationTemplateController.createNotificationTemplate);
pgcoreRouter.put('/notification-template/:id', authMiddleware, requireRole(['ADMIN']), NotificationTemplateController.updateNotificationTemplate);
pgcoreRouter.delete('/notification-template/:id', authMiddleware, requireRole(['ADMIN']), NotificationTemplateController.deleteNotificationTemplate);

// OrderRequirement
pgcoreRouter.get('/order-requirement', OrderRequirementController.getOrderRequirements);
pgcoreRouter.get('/order-requirement/me', authMiddleware, OrderRequirementController.getMyOrderRequirements);
pgcoreRouter.put('/order-requirement/payment/:paymentId', authMiddleware, OrderRequirementController.updatePayment);
pgcoreRouter.get('/order-requirement/admin/:id', authMiddleware, requireRole(['ADMIN']), OrderRequirementController.getAdminOrderRequirement);
pgcoreRouter.get('/order-requirement/:id', OrderRequirementController.getOrderRequirementById);
pgcoreRouter.post('/order-requirement', authMiddleware, requireRole(['ADMIN']), OrderRequirementController.createOrderRequirement);
pgcoreRouter.put('/order-requirement/:id', authMiddleware, requireRole(['ADMIN']), OrderRequirementController.updateOrderRequirement);
pgcoreRouter.delete('/order-requirement/:id', authMiddleware, requireRole(['ADMIN']), OrderRequirementController.deleteOrderRequirement);

// Parameter
pgcoreRouter.post('/file/image', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), FileController.uploadImage);
pgcoreRouter.get('/file/image', authMiddleware, requireRole(['ADMIN']), FileController.getImages);
pgcoreRouter.get('/parameter', ParameterController.getParameters);
pgcoreRouter.get('/parameter/:id', ParameterController.getParameterById);
pgcoreRouter.post('/parameter', authMiddleware, requireRole(['ADMIN']), ParameterController.createParameter);
pgcoreRouter.put('/parameter/:id', authMiddleware, requireRole(['ADMIN']), ParameterController.updateParameter);
pgcoreRouter.delete('/parameter/:id', authMiddleware, requireRole(['ADMIN']), ParameterController.deleteParameter);

// PrintedTemplate
pgcoreRouter.get('/printed-template', PrintedTemplateController.getPrintedTemplates);
pgcoreRouter.get('/printed-template/:id', PrintedTemplateController.getPrintedTemplateById);
pgcoreRouter.post('/printed-template', authMiddleware, requireRole(['ADMIN']), PrintedTemplateController.createPrintedTemplate);
pgcoreRouter.put('/printed-template/:id', authMiddleware, requireRole(['ADMIN']), PrintedTemplateController.updatePrintedTemplate);
pgcoreRouter.delete('/printed-template/:id', authMiddleware, requireRole(['ADMIN']), PrintedTemplateController.deletePrintedTemplate);

// PurchaseAccount
pgcoreRouter.get('/purchase-account', PurchaseAccountController.getPurchaseAccounts);
pgcoreRouter.get('/purchase-account/:id', PurchaseAccountController.getPurchaseAccountById);
pgcoreRouter.post('/purchase-account', authMiddleware, requireRole(['ADMIN']), PurchaseAccountController.createPurchaseAccount);
pgcoreRouter.put('/purchase-account/:id', authMiddleware, requireRole(['ADMIN']), PurchaseAccountController.updatePurchaseAccount);
pgcoreRouter.delete('/purchase-account/:id', authMiddleware, requireRole(['ADMIN']), PurchaseAccountController.deletePurchaseAccount);

// QRCode
pgcoreRouter.get('/q-r-code', QRCodeController.generateQRCode);
pgcoreRouter.post('/qr-code/parser', QRCodeController.decodeQRCode);

// Question
pgcoreRouter.get('/question', QuestionController.getQuestions);
pgcoreRouter.get('/question/:id', QuestionController.getQuestionById);
pgcoreRouter.post('/question', authMiddleware, requireRole(['ADMIN']), QuestionController.createQuestion);
pgcoreRouter.put('/question/:id', authMiddleware, requireRole(['ADMIN']), QuestionController.updateQuestion);
pgcoreRouter.delete('/question/:id', authMiddleware, requireRole(['ADMIN']), QuestionController.deleteQuestion);

// ReceiverInfo
pgcoreRouter.get('/receiver-info', ReceiverInfoController.getReceiverInfos);
pgcoreRouter.get('/receiver-info/me', authMiddleware, ReceiverInfoController.getMyReceiverInfos);
pgcoreRouter.get('/receiver-info/me/:id', authMiddleware, ReceiverInfoController.getMyReceiverInfoById);
pgcoreRouter.get('/receiver-info/:id', ReceiverInfoController.getReceiverInfoById);
pgcoreRouter.post('/receiver-info', authMiddleware, requireRole(['ADMIN']), ReceiverInfoController.createReceiverInfo);
pgcoreRouter.put('/receiver-info/:id', authMiddleware, requireRole(['ADMIN']), ReceiverInfoController.updateReceiverInfo);
pgcoreRouter.delete('/receiver-info/:id', authMiddleware, requireRole(['ADMIN']), ReceiverInfoController.deleteReceiverInfo);

// Service
pgcoreRouter.get('/service', ServiceController.getAll);
pgcoreRouter.get('/service/:id', ServiceController.getById);
pgcoreRouter.post('/service', authMiddleware, requireRole(['ADMIN']), ServiceController.create);
pgcoreRouter.put('/service/:id', authMiddleware, requireRole(['ADMIN']), ServiceController.update);
pgcoreRouter.delete('/service/:id', authMiddleware, requireRole(['ADMIN']), ServiceController.delete);

// StaticPage
pgcoreRouter.get('/static-page', StaticPageController.getAll);
pgcoreRouter.get('/static-page/key/:key', StaticPageController.getByKey);
pgcoreRouter.post('/static-page/image', authMiddleware, requireRole(['ADMIN']), uploadMiddleware.single('file'), StaticPageController.uploadImage);
pgcoreRouter.delete('/static-page/image/:fileId', authMiddleware, requireRole(['ADMIN']), StaticPageController.deleteImage);
pgcoreRouter.get('/static-page/:id', StaticPageController.getById);
pgcoreRouter.post('/static-page', authMiddleware, requireRole(['ADMIN']), StaticPageController.create);
pgcoreRouter.put('/static-page/:id', authMiddleware, requireRole(['ADMIN']), StaticPageController.update);
pgcoreRouter.delete('/static-page/:id', authMiddleware, requireRole(['ADMIN']), StaticPageController.delete);

// Translation
pgcoreRouter.get('/translation/generate', TranslationController.generate);
pgcoreRouter.post('/translation/auto-translate', authMiddleware, requireRole(['ADMIN']), TranslationController.autoTranslate);
pgcoreRouter.get('/translation', TranslationController.getAll);
pgcoreRouter.get('/translation/:id', TranslationController.getById);
pgcoreRouter.post('/translation', authMiddleware, requireRole(['ADMIN']), TranslationController.create);
pgcoreRouter.put('/translation/:id', authMiddleware, requireRole(['ADMIN']), TranslationController.update);
pgcoreRouter.delete('/translation/:id', authMiddleware, requireRole(['ADMIN']), TranslationController.delete);

// UserCustomerType
pgcoreRouter.get('/user-customer-type', UserCustomerTypeController.getAll);
pgcoreRouter.get('/user-customer-type/:id', UserCustomerTypeController.getById);
pgcoreRouter.post('/user-customer-type', authMiddleware, requireRole(['ADMIN']), UserCustomerTypeController.create);
pgcoreRouter.put('/user-customer-type/:id', authMiddleware, requireRole(['ADMIN']), UserCustomerTypeController.update);
pgcoreRouter.delete('/user-customer-type/:id', authMiddleware, requireRole(['ADMIN']), UserCustomerTypeController.delete);

// Tracking
pgcoreRouter.post('/tracking', TrackingController.track);

// CommonInformation
pgcoreRouter.get('/common-infomation/ship-info', CommonInformationController.getShipInfo);
pgcoreRouter.get('/common-infomation/exchange-rate', CommonInformationController.getExchangeRate);

app.use('/api', pgcoreRouter);
app.use('/pgcore/rest-api', pgcoreRouter);
app.use('/ccore/rest-api', pgcoreRouter);

// Proxy for PGWS (Chat & Realtime)
app.use('/pgws/rest-api', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/pgws/rest-api': '', 
    },
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Server is running on port ${PORT}`);
});
