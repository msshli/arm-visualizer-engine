import { ExpressionContext } from '../expressions/expression-context';

export interface Parameters extends ExpressionContext {
    [parameterName: string]: {
        type: string;
        defaultValue?: string | number | boolean | Object | any[];
        value?: string | number | boolean | Object | any[];
        allowedValue?: string[] | number[] | boolean[] | Object[] | any[][];
        minValue?: number;
        maxvalue?: number;
        minLength?: number;
        maxLength?: number;
        description?: string;
    };
}
