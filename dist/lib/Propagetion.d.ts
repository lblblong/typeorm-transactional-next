/**
 * Enumeration that represents transaction propagation behaviors for use with the see {@link Transactional} annotation
 */
export declare enum Propagation {
    /**
     * 使用当前的事务，如果当前没有事务，就抛出异常。
     */
    MANDATORY = "MANDATORY",
    /**
     * 如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与PROPAGATION_REQUIRED类似的操作。
     */
    NESTED = "NESTED",
    /**
     * 以非事务方式执行，如果当前存在事务，则抛出异常。
     */
    NEVER = "NEVER",
    /**
     * 以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。
     */
    NOT_SUPPORTED = "NOT_SUPPORTED",
    /**
     * 如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。这是最常见的选择。
     */
    REQUIRED = "REQUIRED",
    /**
     * 新建事务，如果当前存在事务，把当前事务挂起。
     */
    REQUIRES_NEW = "REQUIRES_NEW",
    /**
     * 支持当前事务，如果当前没有事务，就以非事务方式执行。
     */
    SUPPORTS = "SUPPORTS"
}
