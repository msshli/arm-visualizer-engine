import { expect } from 'chai';

import { ExpressionErrors, Expression, ParametersExpression, TemplateEngine } from '../../../src';

describe('ParametersExpression', () => {
    let exp: Expression;
    let engine: TemplateEngine;

    beforeEach(() => {
        engine = new TemplateEngine();
    });

    describe('evaluate()', () => {
        it('should throw no operand specified error when no operand present', () => {
            exp = new ParametersExpression(engine);

            expect(() => {
                exp.evaluate();
            }).to.throw(ExpressionErrors.TOO_FEW_OPERANDS);
        });

        it('should throw too many operands specified error when more than one operand present', () => {
            exp = new ParametersExpression(engine);
            exp.operands.push('foo');
            exp.operands.push('bar');

            expect(() => {
                exp.evaluate();
            }).to.throw(ExpressionErrors.TOO_MANY_OPERANDS);
        });

        it('should throw no context specified error when no parameters present', () => {
            engine.loadTemplate(`{
                "$schema": "",
                "contentVersion": "",
                "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('foo');

            expect(() => {
                exp.evaluate();
            }).to.throw(ExpressionErrors.NO_CONTEXT + ': parameters');
        });

        it('should throw no key found error when key does not exsits in parameters', () => {
            engine.loadTemplate(`{
              "$schema": "",
              "contentVersion": "",
              "parameters": {},
              "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('foo');

            expect(() => {
                exp.evaluate();
            }).to.throw(ExpressionErrors.NO_KEY_FOUND + ': foo');
        });

        it('should return degenerate parameter expression string when no defaultValue or value present', () => {
            engine.loadTemplate(`{
              "$schema": "",
              "contentVersion": "",
              "parameters": {
                  "foo": {
                      "type": "string"
                  }
              },
              "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('foo');

            expect(exp.evaluate()).to.equal("parameters('foo')");
        });

        it('should return parameter default value when defaultValue present', () => {
            engine.loadTemplate(`{
              "$schema": "",
              "contentVersion": "",
              "parameters": {
                  "foo": {
                      "type": "string",
                      "defaultValue": "bar"
                  }
              },
              "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('foo');

            expect(exp.evaluate()).to.equal('bar');
        });

        it('should return parameter default value when value present', () => {
            engine.loadTemplate(`{
              "$schema": "",
              "contentVersion": "",
              "parameters": {
                  "foo": {
                      "type": "string",
                      "defaultValue": "ignored",
                      "value": "bar"
                  }
              },
              "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('foo');

            expect(exp.evaluate()).to.equal('bar');
        });

        it('should evaluate expression when parameter value is an expression', () => {
            engine.loadTemplate(`{
              "$schema": "",
              "contentVersion": "",
              "parameters": {
                  "foo": {
                      "type": "string",
                      "defaultValue": "[concat('b', 'a', 'r')]"
                  }
              },
              "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('foo');

            expect(exp.evaluate()).to.equal('bar');
        });

        it('should evaluate expression with properties', () => {
            engine.loadTemplate(`{
              "$schema": "",
              "contentVersion": "",
              "parameters": {
                  "a": {
                      "type": "object",
                      "defaultValue": {
                          "b": {
                              "c": "you got me!"
                          }
                      }
                  }
              },
              "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('a');
            exp.properties.push('b');
            exp.properties.push('c');

            expect(exp.evaluate()).to.equal('you got me!');
        });

        it('should evaluate expression with properties when parameter is an expression', () => {
            engine.loadTemplate(`{
              "$schema": "",
              "contentVersion": "",
              "parameters": {
                  "a": {
                      "type": "object",
                      "defaultValue": {
                          "b": {
                              "c": "[concat('you', ' got', ' me!')]"
                          }
                      }
                  }
              },
              "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('a');
            exp.properties.push('b');
            exp.properties.push('c');

            expect(exp.evaluate()).to.equal('you got me!');
        });

        it('should evaluate expression with complex properties when parameter is an expression', () => {
            engine.loadTemplate(`{
                "$schema": "",
                "contentVersion": "",
                "parameters": {
                    "a": {
                        "type": "array",
                        "defaultValue": [
                            0,
                            1,
                            {
                                "c": "[concat('you', ' got', ' me!')]"
                            }
                        ]
                    }
                },
                "resources": []
            }`);

            exp = new ParametersExpression(engine);
            exp.operands.push('a');
            exp.properties.push(2);
            exp.properties.push('c');

            expect(exp.evaluate()).to.equal('you got me!');
        });
    });
});
