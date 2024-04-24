module.exports = function(babel) {
    const { types: t } = babel;
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      visitor: {
        IfStatement(path, state) {
          // 处理if判断
          if (t.isIdentifier(path.node.test, { name: 'DEBUG' })) {
            if (isProduction) {
              path.remove();
            } else {
              const { consequent, alternate } = path.node;
              path.replaceWith(t.ifStatement(t.booleanLiteral(true), consequent, alternate));
            }
          }
        },
        UnaryExpression(path) {
            // 处理一元表达式
            const { operator, argument } = path.node;
            if (operator === "!" && t.isIdentifier(argument, { name: "DEBUG" })) {
                path.replaceWith(isProduction);
            }
        },
        ConditionalExpression(path) {
            // 处理三元运算符
            const { test, consequent, alternate } = path.node;
            if (t.isIdentifier(test, { name: "DEBUG" })) {
                const replacement = t.conditionalExpression(
                    t.booleanLiteral(isProduction ? false : true),
                    consequent,
                    alternate
                )
                path.replaceWith(replacement);
            }
          },
        LogicalExpression(path) {
            // 处理逻辑运算符
            const { left, right, operator } = path.node;
            if (operator === "&&") {
              const condition = left;
              const trueBlock = t.blockStatement([t.returnStatement(right)]);
              const falseBlock = t.blockStatement([t.returnStatement(t.booleanLiteral(false))]);
              const ifStatement = t.ifStatement(condition, trueBlock, falseBlock);
              path.replaceWith(ifStatement);
            }
          }
      }
    };
  };
  