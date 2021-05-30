import { Propagation } from './Propagetion';
import { IsolationLevel } from './IsolationLevel';
export declare function Transaction(options?: {
    connectionName?: string | (() => string | undefined);
    propagation?: Propagation;
    isolationLevel?: IsolationLevel;
}): (_target: any, _propertyName: string, propertyDescriptor: PropertyDescriptor) => PropertyDescriptor;
