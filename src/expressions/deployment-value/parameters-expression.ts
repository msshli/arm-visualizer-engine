import { ExpressionErrors } from '../../constants';
import { Expression, ContextualExpressionBase } from '../expression-base';
import { Parameters, Template } from '../../template';

/**
 * ParametersExpression
 */
export class ParametersExpression extends ContextualExpressionBase {
    protected context: Parameters;

    evaluate(): string | Object | any[] {
        if (this._operands.length === 0) {
            throw new Error(ExpressionErrors.TOO_FEW_OPERANDS);
        }
        if (this._operands.length > 1) {
            throw new Error(ExpressionErrors.TOO_MANY_OPERANDS);
        }

        if (!this.context) {
            throw new Error(ExpressionErrors.NO_CONTEXT + ': parameters');
        }

        let key: string = typeof this.operands[0] === 'string'
            ? <string>this.operands[0]
            : <string>(<Expression>this.operands[0]).evaluate();

        if (!(key in this.context)) {
            throw new Error(ExpressionErrors.NO_KEY_FOUND + ': ' + key);
        }

        let valueObj = this.context[key];
        let value = valueObj.value || valueObj.defaultValue;

        if (!value && value !== '') {
            return "parameters('" + key + "')";
        }

        if (typeof value === 'string') {
            return this.parser.parse(value);
        }

        return value;
    }

    protected setContext(template: Template) {
       this.context = template.parameters;
    }
}