var typeorm = require('typeorm');
var clsHooked = require('cls-hooked');
var nanoid$1 = require('nanoid');

var NAMESPACE_KEY = '_lbl_transaction_';
var ENTITY_MANAGER_KEY = '_lbl_transtion_entity_manager_';
var ns = clsHooked.createNamespace(NAMESPACE_KEY);

function useTransaction() {
  return ns.runAndReturn(function () {
    var tsm = ns.get(ENTITY_MANAGER_KEY);
    if (tsm) return tsm;
    return typeorm.getManager();
  });
}

(function (IsolationLevel) {
  IsolationLevel["READ_UNCOMMITTED"] = "READ UNCOMMITTED";
  IsolationLevel["READ_COMMITTED"] = "READ COMMITTED";
  IsolationLevel["REPEATABLE_READ"] = "REPEATABLE READ";
  IsolationLevel["SERIALIZABLE"] = "SERIALIZABLE";
})(exports.IsolationLevel || (exports.IsolationLevel = {}));

(function (Propagation) {
  Propagation["MANDATORY"] = "MANDATORY";
  Propagation["NESTED"] = "NESTED";
  Propagation["NEVER"] = "NEVER";
  Propagation["NOT_SUPPORTED"] = "NOT_SUPPORTED";
  Propagation["REQUIRED"] = "REQUIRED";
  Propagation["REQUIRES_NEW"] = "REQUIRES_NEW";
  Propagation["SUPPORTS"] = "SUPPORTS";
})(exports.Propagation || (exports.Propagation = {}));

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

// Asynchronously await a promise and pass the result to a finally continuation
function _finallyRethrows(body, finalizer) {
	try {
		var result = body();
	} catch (e) {
		return finalizer(true, e);
	}
	if (result && result.then) {
		return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
	}
	return finalizer(false, result);
}

var nanoid = nanoid$1.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 18);
function Transaction(options) {
  options = options || {
    propagation: exports.Propagation.REQUIRED
  };
  return function (_target, _propertyName, propertyDescriptor) {
    var method = propertyDescriptor.value;

    propertyDescriptor.value = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      try {
        var _this2 = this;

        return Promise.resolve(ns.runAndReturn(function () {
          var lastTsm = ns.get(ENTITY_MANAGER_KEY);

          var run = function run() {
            try {
              return Promise.resolve(method.apply(_this2, [].concat(args)));
            } catch (e) {
              return Promise.reject(e);
            }
          };

          var runWithNewTransaction = function runWithNewTransaction() {
            try {
              var transactionCallback = function transactionCallback(tsm) {
                try {
                  return Promise.resolve(ns.runAndReturn(function () {
                    try {
                      tsm.id = nanoid();
                      return Promise.resolve(_finallyRethrows(function () {
                        return _catch(function () {
                          ns.set(ENTITY_MANAGER_KEY, tsm);
                          return Promise.resolve(method.apply(_this2, args));
                        }, function (err) {
                          throw err;
                        });
                      }, function (_wasThrown, _result) {
                        ns.set(ENTITY_MANAGER_KEY, lastTsm);
                        if (_wasThrown) throw _result;
                        return _result;
                      }));
                    } catch (e) {
                      return Promise.reject(e);
                    }
                  }));
                } catch (e) {
                  return Promise.reject(e);
                }
              };

              if (options.isolationLevel) {
                return Promise.resolve(typeorm.getManager().transaction(options.isolationLevel, transactionCallback));
              } else {
                return Promise.resolve(typeorm.getManager().transaction(transactionCallback));
              }
            } catch (e) {
              return Promise.reject(e);
            }
          };

          var runWithNoTransaction = ns.runAndReturn(function () {
            return function () {
              try {
                return Promise.resolve(_finallyRethrows(function () {
                  return _catch(function () {
                    ns.set(ENTITY_MANAGER_KEY, typeorm.getManager());
                    return Promise.resolve(method.apply(_this2, args));
                  }, function (err) {
                    throw err;
                  });
                }, function (_wasThrown2, _result2) {
                  ns.set(ENTITY_MANAGER_KEY, lastTsm);
                  if (_wasThrown2) throw _result2;
                  return _result2;
                }));
              } catch (e) {
                return Promise.reject(e);
              }
            };
          });

          switch (options.propagation) {
            case exports.Propagation.REQUIRED:
              if (lastTsm) {
                return run();
              } else {
                return runWithNewTransaction();
              }

            case exports.Propagation.SUPPORTS:
              if (lastTsm) {
                return run();
              } else {
                return runWithNoTransaction();
              }

            case exports.Propagation.MANDATORY:
              if (lastTsm) {
                return run();
              } else {
                throw Error('Transaction propagation：MANDATORY');
              }

            case exports.Propagation.REQUIRES_NEW:
              return runWithNewTransaction();

            case exports.Propagation.NOT_SUPPORTED:
              return runWithNoTransaction();

            case exports.Propagation.NEVER:
              if (lastTsm) {
                throw Error('Transaction NEVER');
              } else {
                return runWithNoTransaction();
              }

            case exports.Propagation.NESTED:
              return runWithNewTransaction();
          }
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return propertyDescriptor;
  };
}

exports.Transaction = Transaction;
exports.useTransaction = useTransaction;
//# sourceMappingURL=index.js.map
