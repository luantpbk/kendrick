package com.smartcard.persistence.dao;

import java.lang.reflect.Field;
import javax.persistence.Query;
import javax.persistence.criteria.ParameterExpression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.Parameter;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Selection;
import javax.persistence.TypedQuery;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.transaction.Transactional;

import com.smartcard.exception.GlobalException;
import com.smartcard.persistence.entity.BaseEntity;
import com.smartcard.ws.CurrentContextService;
import javax.persistence.EntityManager;

public abstract class AbstractBaseJpaDao<T> {
	private Class<T> entityClass;
	private final List<Field> fields;

	public AbstractBaseJpaDao(final Class<T> entityClass) {
		this.entityClass = entityClass;
		this.fields = new ArrayList<Field>();
		Collections.addAll(this.fields, entityClass.getDeclaredFields());
		Class<?> superClass = entityClass.getSuperclass();
		while (superClass != null) {
			Collections.addAll(this.fields, superClass.getDeclaredFields());
			superClass = superClass.getSuperclass();
		}
	}

	protected abstract EntityManager getEntityManager();

	private Field findByFieldName(final String fieldName) {
		for (Field sf : fields) {
			String name = sf.getName();
			if (name.equals(fieldName))
				return sf;
		}
		return null;
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public T create(final T entity) {
		if (entity instanceof BaseEntity) {
			((BaseEntity) entity).setDeleteFlg(new Integer(0));
			String createdBy = null;
			try {
				createdBy = CurrentContextService.getCurrentContext().getLoginName();
			} catch (Exception e) {
				createdBy = ((BaseEntity) entity).getCreatedBy();
			}
			((BaseEntity) entity).setCreatedBy(createdBy);
		}
		this.getEntityManager().persist(entity);
		return entity;
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public T edit(final T entity) {
		if (entity instanceof BaseEntity) {
			((BaseEntity) entity).setDeleteFlg(new Integer(0));
			String updatedBy = null;
			try {
				updatedBy = CurrentContextService.getCurrentContext().getLoginName();
			} catch (Exception e) {
				updatedBy = ((BaseEntity) entity).getUpdatedBy();
			}
			((BaseEntity) entity).setUpdatedBy(updatedBy);
		}
		return (T) this.getEntityManager().merge(entity);
	}

	public void remove(final T entity) throws GlobalException {
		if (entity instanceof BaseEntity) {
			((BaseEntity) entity).setDeleteFlg(new Integer(1));
			((BaseEntity) entity).setUpdatedBy(CurrentContextService.getCurrentContext().getLoginName());
		}
		this.getEntityManager().merge(entity);
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public T get(final Object id) {
		if (id == null)
			return null;
		T entity = this.getEntityManager().find(this.entityClass, id);
		return entity instanceof BaseEntity && Integer.valueOf(1).equals(((BaseEntity) entity).getDeleteFlg()) ? null : entity;
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public List<T> findAll() {

		final TypedQuery<T> query;
		if (findByFieldName("deleteFlg") != null) {
			query = (TypedQuery<T>) this.getEntityManager().createQuery("SELECT t FROM "
					+ this.entityClass.getSimpleName() + " t WHERE t.deleteFlg <> 1 ORDER BY t.displayOrder ",
					this.entityClass);
		} else {
			query = (TypedQuery<T>) this.getEntityManager().createQuery(
					"SELECT t FROM " + this.entityClass.getSimpleName() + " t ORDER BY t.displayOrder ",
					this.entityClass);
		}
		final List<T> ret = (List<T>) query.getResultList();
		return ret;
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public List<T> findRange(final int[] range) {
		final CriteriaBuilder cb = this.getEntityManager().getCriteriaBuilder();
		final CriteriaQuery<T> cq = (CriteriaQuery<T>) cb.createQuery(this.entityClass);
		final Root<T> r = (Root<T>) cq.from(this.entityClass);
		final ParameterExpression<Integer> p = (ParameterExpression<Integer>) cb.parameter(Integer.class);
		cq.select((Selection) r).where((Expression) cb.lt((Expression) r.get("deleteFlg"), (Expression) p));
		final Query q = (Query) this.getEntityManager().createQuery((CriteriaQuery) cq);
		q.setParameter((Parameter) p, (Object) 1);
		q.setMaxResults(range[1] - range[0]);
		q.setFirstResult(range[0]);
		return (List<T>) q.getResultList();
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public List<T> findRangeByCriteria(final int[] range, final CriteriaQuery<T> query) {
		final Query q = (Query) this.getEntityManager().createQuery((CriteriaQuery) query);
		q.setMaxResults(range[1] - range[0]);
		q.setFirstResult(range[0]);
		return (List<T>) q.getResultList();
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public List<T> findRangeByNativeQuery(final int[] range, final String query) {
		final Query q = this.getEntityManager().createQuery(query);
		q.setMaxResults(range[1] - range[0]);
		q.setFirstResult(range[0]);
		return (List<T>) q.getResultList();
	}

	@Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = { Throwable.class })
	public int count() {
		final CriteriaBuilder cb = this.getEntityManager().getCriteriaBuilder();
		final CriteriaQuery<T> cq = cb.createQuery(entityClass);
		final Root<T> rt = (Root<T>) cq.from(this.entityClass);
		final Expression<Long> exp = (Expression<Long>) this.getEntityManager().getCriteriaBuilder()
				.count((Expression) rt);
		final ParameterExpression<Integer> p = (ParameterExpression<Integer>) cb.parameter(Integer.class);
		cq.select((Selection) exp).where((Expression) cb.lt((Expression) rt.get("deleteFlg"), (Expression) p));
		final TypedQuery<Object> q = (TypedQuery<Object>) this.getEntityManager().createQuery((CriteriaQuery) cq);
		q.setParameter((Parameter) p, (Object) 1);
		return ((Long) q.getSingleResult()).intValue();
	}

	public void delete(final T entity) {
		this.getEntityManager().remove((Object) entity);
	}

	public <U> List<T> getListByField(String fieldName, U value, final Class<U> fieldClass) {
		if (value == null || (fieldClass.equals(String.class) && value.toString().isEmpty()))
			return new ArrayList<T>();
		CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(entityClass);
		Root<T> r = cq.from(entityClass);
		ParameterExpression<U> patternParam = cb.parameter(fieldClass);

		Predicate condition = cb.equal(r.get(fieldName), patternParam);
		if (findByFieldName("deleteFlg") != null) {
			Predicate deleteCondition = cb.equal(r.get("deleteFlg"), 0);
			condition = cb.and(condition, deleteCondition);
		}
		cq.where(condition);
	
		cq.select(r);
		TypedQuery<T> q = this.getEntityManager().createQuery(cq);

		q.setParameter(patternParam, value);

		List<T> result = q.getResultList();
		return result;
	}

	public <U> T getByField(String fieldName, U value, final Class<U> fieldClass) {
		List<T> list = getListByField(fieldName, value, fieldClass);
		return list == null || list.isEmpty() ? null : list.get(0);
	}
}
