import clone from 'lodash/clone';

function errorHandler(error) {
  let feathersError = error;

  // todo may be add mapping from typeorm error to fetathers, like this:
  // import errors from '@feathersjs/errors';
  // if (error.name) {
  // 	switch (error.name) {
  // 		case 'SequelizeValidationError':
  // 		case 'SequelizeUniqueConstraintError':
  // 		case 'SequelizeExclusionConstraintError':
  // 		case 'SequelizeForeignKeyConstraintError':
  // 		case 'SequelizeInvalidConnectionError':
  // 			feathersError = new errors.BadRequest(error);
  // 			break;
  // 		case 'SequelizeTimeoutError':
  // 		case 'SequelizeConnectionTimedOutError':
  // 			feathersError = new errors.Timeout(error);
  // 			break;
  // 		case 'SequelizeConnectionRefusedError':
  // 		case 'SequelizeAccessDeniedError':
  // 			feathersError = new errors.Forbidden(error);
  // 			break;
  // 		case 'SequelizeHostNotReachableError':
  // 			feathersError = new errors.Unavailable(error);
  // 			break;
  // 		case 'SequelizeHostNotFoundError':
  // 			feathersError = new errors.NotFound(error);
  // 			break;
  // 	}
  // }

  throw feathersError;
}

const sortingExtendSyntaxExample = `{
fieldName: { $values: ["one", "two"], $direction: -1 },
fieldName2: { $values: { one: 1, two: 2 }, $direction: -1, $disjointWeight: 0 },
}`;

function getOrder(sort = {}) {
  let order = [];

  Object.keys(sort).forEach(fieldName => {
    const rule = sort[fieldName];

    if (typeof rule === 'object') {

      if (!rule) {
        console.log('Unsupported order rule', { fieldName, rule, shouldBeLike: sortingExtendSyntaxExample, sort });
        throw new Error('Unsupported order rule');
      }

      const values = Array.isArray(rule) ? rule : rule.$values;
      const direction = Array.isArray(rule) ? 'ASC' : (parseInt(rule.$direction, 10) === -1 ? 'DESC' : 'ASC');

      let caseString = 'CASE';

      if (Array.isArray(values)) {
        values.forEach((value, i) => {
          caseString += ` WHEN ${fieldName} = '${value}' THEN ${i + 1}`;
        });

      } else if (typeof values === 'object') {

        for (let value in values) {
          const weight = values[value] === '$self' ? fieldName : (
            typeof values[value] === 'number' ? values[value] : `'${values[value]}'`
          );

          if (value === '$notNull') {
            caseString += ` WHEN ${fieldName} IS NOT NULL THEN ${weight}`;
          } else {
            caseString += ` WHEN ${fieldName} = '${value}' THEN ${weight}`;
          }
        }
      } else {
        console.log('Incorrect values type', rule);
        throw new Error('Incorrect values type');
      }

      const disjointWeight = typeof rule.$disjointWeight !== 'undefined' ? rule.$disjointWeight : values.length;

      caseString += " ELSE " + (typeof disjointWeight === 'number' ? disjointWeight : `'${disjointWeight}'`) + " END";

      order.push([caseString, direction]);
    } else if (fieldName) {
      const direction = parseInt(sort[fieldName], 10) === 1 ? 'ASC' : 'DESC';
      order.push([fieldName, direction]);
    }
  });

  return order;
}

function getLimit(limit, paginate) {
  if (paginate && paginate.default) {
    const lower = typeof limit === 'number' ? limit : paginate.default;
    const upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;

    return Math.min(lower, upper);
  }

  return limit;
}

function getSelect($select, repository) {
  return $select && $select.length ? $select.map(field => `${repository.target}.${field}`) : undefined;
}

function getWhereSql(rawConditions) {
  const { $limit, $skip, ...conditions } = rawConditions;
  if (!conditions || !Object.keys(conditions).length) {
    return;
  }

  return sqlFromMongo(conditions);
}

function createParamsWithId(id, params) {
  if (id !== null && typeof id === 'object') {
    debugger
  }

  return {
    ...(params || {}),
    query: {
      ...(params && params.query || {}),
      ...(id && { id } || {})
    },
  };
}

export class TypeormFeathersAdapter {

  constructor(options) {
    if (!options) {
      throw new Error('Sequelize options have to be provided');
    }

    if (!options.repository) {
      throw new Error('You must provide a typeORM repository');
    }

    this.paginate = options.paginate || {};
    this.repository = options.repository;
  }

  createOrderSql = (acc, orderItem) => {
    return (acc && `${acc}, ` || '') + orderItem && orderItem.join(' ') || '';
  };

  _createQueryBuilder(params) {
    const { query } = params;
    const {
      $sort,
      $select,
      $withoutFilters,
      ...conditions
    } = query || {};

    const whereSql = getWhereSql(conditions);

    if (!whereSql && !$withoutFilters) {
      debugger
      throw new Error('Query without any condition not allowed, add $withoutFilters: true to query if need all entities');
    }
    const order = getOrder($sort);

    const columns = $select || this.repository.metadata.ownColumns.map(column => column.databaseName);
    const select = getSelect(columns, this.repository);

    let qb = this.repository.createQueryBuilder(undefined, this.repository.manager.connection.driver.queryRunner)
      .select(select)
      .where(whereSql);

    !!order && order.forEach(item => {
      const [condition, direction] = item;
      qb = qb.addOrderBy(condition, direction);
    });

    return qb;
  }

  _createWhereSql(query) {
    const {
      $sort,
      $select,
      $withoutFilters,
      ...conditions
    } = query || {};

    return getWhereSql(conditions);
  }

  _createSelectSql(query) {
    const {
      $select,
    } = query || {};


    const columns = $select || this.repository.metadata.ownColumns.map(column => column.databaseName);
    return getSelect(columns, this.repository);
  }

  _createOrderSql(query) {
    const {
      $sort,
    } = query;
    const order = getOrder($sort);
    return order.reduce(this.createOrderSql, '');
  }

  _find(params, paginate) {
    const { query } = params;
    const {
      $limit,
      $skip,
    } = query || {};

    const limit = getLimit($limit, paginate);
    const skip = $skip || 0;

    let queryBuilder = this._createQueryBuilder(params, paginate);

    if (limit) {
      queryBuilder = queryBuilder.take(limit)
    }

    if (skip) {
      queryBuilder = queryBuilder.skip(skip)
    }

    if (paginate) {
      if (limit === 0) {
        return queryBuilder.getCount().then(count => {
          return {
            limit,
            skip,
            data: null,
            total: count,
          };
        }).catch(errorHandler);
      }

      return queryBuilder.getManyAndCount().then(result => {
        const [data, total] = result;
        return { data, total, limit, skip };
      }).catch(errorHandler);
    } else {
      return queryBuilder.getMany().then(data => {
        return { data };
      }).catch(errorHandler);
    }
  }

  _findRaw = async (params, paginate) => {
    const start = performance.now();
    const { query } = params;
    const {
      $limit,
      $skip,
    } = query || {};

    const limit = getLimit($limit, paginate);
    const skip = $skip || 0;

    const whereSql = this._createWhereSql(query);
    const tableName = this.repository.target;
    const { queryRunner } = this.repository.manager.connection.driver;

    let total;
    if (paginate) {
      const countKey = 'COUNT (*)';
      const countSql = `SELECT ${countKey} FROM ${tableName}` + (whereSql ? ` WHERE ${whereSql}` : '');
      const countRes = await queryRunner.query(countSql);
      total = countRes[0][countKey];

      console.log({ total, countRes });

      if (limit === 0) {
        return Promise.resolve({ limit, skip, total });
      }
    }

    const select = this._createSelectSql(query);
    let sql = `SELECT ${select} FROM ${tableName}`;

    if (whereSql) {
      sql += ` WHERE ${whereSql}`;
    }

    const orderSql = this._createOrderSql(query);

    if (orderSql) {
      sql += ` ORDER BY ${orderSql}`;
    }

    if (limit) {
      sql += ` LIMIT ${limit}${skip && `, ${skip}` || ''}`;
    }

    const data = await queryRunner.query(sql);

    return Promise.resolve({ data, total, limit, skip });
  };

  find(params) {
    const paginate = params.paginate || this.paginate;
    const result = this._find(params, paginate).catch(errorHandler);

    if (!paginate.default) {
      return result.then(page => page.data);
    }


    return result;
  }

  _get(id, params) {
    const paramsWithId = createParamsWithId(id, params);
    const queryBuilder = this._createQueryBuilder(paramsWithId);

    return queryBuilder.getOne().catch(errorHandler);
  }

  get(id, params) {
    if (id === null) {
      return this._find(params).then(res => res.data && res.data[0]);
    }

    return this._get(id, params);
  }

  _create = async (dataItem, params) => {

    let inserted;

    try {
      inserted = await this.repository.insert(dataItem);
    } catch (e) {
      return errorHandler(e);
    }

    const item = inserted.identifiers[0] || inserted.generatedMaps[0];
    const id = item && item.id;

    if (!id) {
      debugger
      throw new Error('Entity does not created');
    }
    return this._get(id);

  };


  create(data, params) {
    if (Array.isArray(data) && !data.length) {
      throw new Error('Cant create entity with empty data');
    }

    const useData = clone(data);

    if (Array.isArray(useData)) {
      // map because of bug in typeorm, if insert array of data, returned data (atleast ids) will be incorrect, https://github.com/typeorm/typeorm/issues/2131
      return Promise.all(useData.map(item => this._create(item, params)));
    }

    return this._create(useData, params);
  }

  async patch(id, data, params) {
    const paramsWithId = createParamsWithId(id, params);
    const queryBuilder = this._createQueryBuilder(paramsWithId);

    const entities = await queryBuilder.getMany();
    const entityIds = entities.map(entity => entity.id);

    const useData = clone(data);

    return queryBuilder.update().set(useData).execute()
      .then(() => entityIds.length ? this.repository.findByIds(entityIds) : null)
      .catch(errorHandler);
  }

  update(id, data, params) {
    const useData = clone(data);
    return this.patch(id, useData, params);
  }

  async remove(id, params) {
    const paramsWithId = createParamsWithId(id, params);
    const queryBuilder = this._createQueryBuilder(paramsWithId);

    const returnData = await queryBuilder.getMany();

    return queryBuilder.delete().execute().then(() => returnData).catch(errorHandler);
  }
}

var type = (function() {
  var classToType, i, len, name, ref;
  classToType = {};
  ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
  for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    classToType["[object " + name + "]"] = name.toLowerCase();
  }
  return function(obj) {
    var strType;
    strType = Object.prototype.toString.call(obj);
    return classToType[strType] || "object";
  };
})();

function sqlFromMongo(mongoQueryObject, collectionName, fields) {
  var JOIN_LOOKUP, containsDollars, field, fieldStringParts, fieldsString, key, keys, parseSingleKeyValuePair, parts, prefix, sql, subObject, value;
  if ((fields != null) && (collectionName == null)) {
    throw new Error("Must provide a collectionName if fields is provided.");
  }
  JOIN_LOOKUP = {
    $and: " AND ",
    $or: " OR ",
    $nor: " OR "
  };

  containsDollars = function(obj) {
    return Object.keys(obj).filter(function(key) {
      return key[0] === '$' || typeof obj[key] === 'object' && containsDollars(obj[key]);
    }).length > 0;
  };

  if (type(mongoQueryObject) === 'string') { // mongoQueryObject.toUpperCase().indexOf('SELECT') === 0
    return mongoQueryObject;
  }

  parseSingleKeyValuePair = function(key, value, collectionName) {
    var i, joinOperator, key2, keys, len, maxDistance, minDistance, o, parts, s, value2, valueKey, valueValue;
    switch (key) {
      case "$not":
        s = sqlFromMongo(value, collectionName);
        if (s.indexOf("(") === 0) {
          return "NOT " + s;
        } else {
          return "NOT (" + s + ")";
        }
        break;
      case "$and":
      case "$or":
      case "$nor":
        if (type(value) !== "array") {
          throw new Error("Use of $and, $or, or $nor operator requires an array as its parameter.");
        }
        parts = [];
        for (i = 0, len = value.length; i < len; i++) {
          o = value[i];
          parts.push(sqlFromMongo(o, collectionName));
        }
        joinOperator = JOIN_LOOKUP[key];
        s = "(" + parts.join(joinOperator) + ")";
        if (key === "$nor") {
          return "NOT " + s;
        } else {
          return s;
        }
        break;
      default:
        if (type(value) === "object") {
          parts = [];
          s = (prefix + key) + " ";
          for (valueKey in value) {
            valueValue = value[valueKey];
            switch (valueKey) {
              case "$lt":
                parts.push(s + ("< " + (JSON.stringify(valueValue))));
                break;
              case "$gt":
                parts.push(s + ("> " + (JSON.stringify(valueValue))));
                break;
              case "$lte":
                parts.push(s + ("<= " + (JSON.stringify(valueValue))));
                break;
              case "$gte":
                parts.push(s + (">= " + (JSON.stringify(valueValue))));
                break;
              case "$ne":
                parts.push(s + ("!= " + (JSON.stringify(valueValue))));
                break;
              case "$eq":
                parts.push(s + ("= " + (JSON.stringify(valueValue))));
                break;
              case "$elemMatch":
                if (containsDollars(valueValue)) {
                  throw new Error("DocumentDB can only match explicit values of array objects");
                }
                return "ARRAY_CONTAINS(" + (prefix + key) + ", " + (JSON.stringify(valueValue)) + ", true)";
              case "$like":
                  s = JSON.stringify(valueValue);
                  return (prefix + key) + " LIKE (" + s + ")";
                break;
              case "$in":
                if (type(valueValue) === 'array') {
                  // if (valueValue.length > 100) {
                  //   throw new Error("In DocumentDB the maximum number of values per IN expression is 100");
                  // }
                  s = JSON.stringify(valueValue);
                  s = s.substr(1, s.length - 2);
                  return (prefix + key) + " IN (" + s + ")";
                } else {
                  return "ARRAY_CONTAINS(" + (prefix + valueValue) + ", " + key + ")";
                }
                break;
              case "$nin":
                if (type(valueValue) === 'array') {
                  // if (valueValue.length > 100) {
                  //   throw new Error("In DocumentDB the maximum number of values per IN expression is 100");
                  // }
                  s = JSON.stringify(valueValue);
                  s = s.substr(1, s.length - 2);
                  return "NOT " + (prefix + key) + " IN (" + s + ")";
                } else {
                  return "NOT ARRAY_CONTAINS(" + (prefix + valueValue) + ", " + key + ")";
                }
                break;
              case "$size":
                return "ARRAY_LENGTH(" + (prefix + key) + ") = " + valueValue;
              case "$exists":
                if (valueValue) {
                  return "IS_DEFINED(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_DEFINED(" + (prefix + key) + ")";
                }
                break;
              case "$isArray":
                if (valueValue) {
                  return "IS_ARRAY(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_ARRAY(" + (prefix + key) + ")";
                }
                break;
              case "$isBool":
                if (valueValue) {
                  return "IS_BOOL(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_BOOL(" + (prefix + key) + ")";
                }
                break;
              case "$isNull":
                if (valueValue) {
                  return "IS_NULL(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_NULL(" + (prefix + key) + ")";
                }
                break;
              case "$isNumber":
                if (valueValue) {
                  return "IS_NUMBER(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_NUMBER(" + (prefix + key) + ")";
                }
                break;
              case "$isObject":
                if (valueValue) {
                  return "IS_OBJECT(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_OBJECT(" + (prefix + key) + ")";
                }
                break;
              case "$isString":
                if (valueValue) {
                  return "IS_STRING(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_STRING(" + (prefix + key) + ")";
                }
                break;
              case "$isPrimitive":
                if (valueValue) {
                  return "IS_PRIMITIVE(" + (prefix + key) + ")";
                } else {
                  return "NOT IS_PRIMITIVE(" + (prefix + key) + ")";
                }
                break;
              case "$startsWith":
                return "STARTSWITH(" + (prefix + key) + ", " + (JSON.stringify(valueValue)) + ")";
              case "$endsWith":
                return "ENDSWITH(" + (prefix + key) + ", " + (JSON.stringify(valueValue)) + ")";
              case "$contains":
                return "CONTAINS(" + (prefix + key) + ", " + (JSON.stringify(valueValue)) + ")";
              case "$geoWithin":
                return "ST_WITHIN(" + (prefix + key) + ", " + (JSON.stringify(valueValue)) + ")";
              case "$near":
                maxDistance = valueValue.$maxDistance;
                minDistance = valueValue.$minDistance;
                if (maxDistance != null) {
                  if (minDistance != null) {
                    return "(ST_DISTANCE(" + (prefix + key) + ", " + (JSON.stringify(valueValue.$geometry)) + ") <= " + maxDistance + " AND ST_DISTANCE(" + (prefix + key) + ", " + (JSON.stringify(valueValue.$geometry)) + ") >= " + minDistance + ")";
                  } else {
                    return "ST_DISTANCE(" + (prefix + key) + ", " + (JSON.stringify(valueValue.$geometry)) + ") <= " + maxDistance;
                  }
                }
                if (minDistance != null) {
                  return "ST_DISTANCE(" + (prefix + key) + ", " + (JSON.stringify(valueValue.$geometry)) + ") >= " + minDistance;
                } else {
                  throw new Error("No minDistance nor maxDistance found in {" + (prefix + key) + ": " + (JSON.stringify(value)) + "}");
                }
                break;
              case "$not":
                if (valueValue === null) {
                  return "" + (prefix + key) + " IS NOT NULL";
                }
              default:
                throw new Error("sql-from-mongo does not recognize {" + (prefix + key) + ": " + (JSON.stringify(value)) + "}");
            }
          }
          keys = [];
          for (key2 in value) {
            value2 = value[key2];
            keys.push(key2);
          }
          if (keys.length === 1) {
            return parts[0];
          } else {
            return "(" + parts.join(" AND ") + ")";
          }
        } else if (value === null) {
          return (prefix + key) + " IS NULL";
        } else if (Array.isArray(value)) {
          throw new Error('Use $in/$or statement for multiple values');
        } else {
          return (prefix + key) + " = " + (JSON.stringify(value));
        }
    }
  };
  if ((collectionName != null) && collectionName.length > 0) {
    prefix = collectionName + ".";
  } else {
    prefix = "";
  }
  keys = [];
  for (key in mongoQueryObject) {
    value = mongoQueryObject[key];
    keys.push(key);
  }
  if (keys.length === 1) {
    parts = [parseSingleKeyValuePair(keys[0], mongoQueryObject[keys[0]], collectionName)];
  } else {
    parts = [];
    for (key in mongoQueryObject) {
      value = mongoQueryObject[key];
      subObject = {};
      subObject[key] = value;
      parts.push(sqlFromMongo(subObject, collectionName));
    }
  }
  if (parts.length === 1) {
    sql = parts[0];
  } else {
    sql = "(" + parts.join(" AND ") + ")";
  }
  if (fields != null) {
    if (fields === '*' || (fields[0] === '*') || fields === true) {
      fieldsString = '*';
    } else {
      fieldStringParts = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = fields.length; i < len; i++) {
          field = fields[i];
          results.push(prefix + field);
        }
        return results;
      })();
      fieldsString = fieldStringParts.join(", ");
    }
    sql = ("SELECT " + fieldsString + " FROM " + collectionName + " WHERE ") + sql;
  }
  return sql;
}

