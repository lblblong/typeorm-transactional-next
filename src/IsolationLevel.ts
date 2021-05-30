/**
 * Enumeration that represents transaction isolation levels for use with the {@link Transactional} annotation
 */
export enum IsolationLevel {
  /**
   * 读未提交（基础事务）
   */
  READ_UNCOMMITTED = 'READ UNCOMMITTED',
  /**
   * 读已提交（解决脏读问题）
   */
  READ_COMMITTED = 'READ COMMITTED',
  /**
   * 可重复读（解决脏读、不可重复读问题）
   */
  REPEATABLE_READ = 'REPEATABLE READ',
  /**
   * 串行化（解决任何问题）
   */
  SERIALIZABLE = 'SERIALIZABLE'
}
