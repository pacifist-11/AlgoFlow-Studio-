/**
 * Helper to generate code templates for the 10 Loop Patterns in 5 different languages:
 * Java, Python, C++, C, JavaScript.
 */

export const getPatternCodeTemplate = (pattern, language, rows = 5, symbol = '*') => {
  // Format the character to print based on selected symbol option
  const getSymbolExpression = (lang, colVar) => {
    if (symbol === 'Numbers') {
      if (lang === 'Java') return `${colVar} + " "`;
      if (lang === 'Python') return `f"{${colVar}} "`;
      if (lang === 'C++') return `${colVar} << " "`;
      if (lang === 'C') return `"%d ", ${colVar}`;
      if (lang === 'JavaScript') return `\${${colVar}} `;
    } else if (symbol === 'Letters') {
      if (lang === 'Java') return `(char)('A' + ${colVar} - 1) + " "`;
      if (lang === 'Python') return `chr(64 + ${colVar}) + " "`;
      if (lang === 'C++') return `(char)('A' + ${colVar} - 1) << " "`;
      if (lang === 'C') return `"%c ", (char)('A' + ${colVar} - 1)`;
      if (lang === 'JavaScript') return `\${String.fromCharCode(64 + ${colVar})} `;
    } else {
      // Literal symbol like '*', '#', '@', '$'
      if (lang === 'Java') return `"${symbol} "`;
      if (lang === 'Python') return `"${symbol} "`;
      if (lang === 'C++') return `"${symbol} "`;
      if (lang === 'C') return `"${symbol} "`;
      if (lang === 'JavaScript') return `"${symbol} "`;
    }
  };

  const getSymbolExprWithoutSpace = (lang, colVar) => {
    if (symbol === 'Numbers') {
      if (lang === 'Java') return `${colVar}`;
      if (lang === 'Python') return `f"{${colVar}}"`;
      if (lang === 'C++') return `${colVar}`;
      if (lang === 'C') return `"%d", ${colVar}`;
      if (lang === 'JavaScript') return `\${${colVar}}`;
    } else if (symbol === 'Letters') {
      if (lang === 'Java') return `(char)('A' + ${colVar} - 1)`;
      if (lang === 'Python') return `chr(64 + ${colVar})`;
      if (lang === 'C++') return `(char)('A' + ${colVar} - 1)`;
      if (lang === 'C') return `"%c", (char)('A' + ${colVar} - 1)`;
      if (lang === 'JavaScript') return `\${String.fromCharCode(64 + ${colVar})}`;
    } else {
      if (lang === 'Java') return `"${symbol}"`;
      if (lang === 'Python') return `"${symbol}"`;
      if (lang === 'C++') return `"${symbol}"`;
      if (lang === 'C') return `"${symbol}"`;
      if (lang === 'JavaScript') return `"${symbol}"`;
    }
  };

  const rawSym = symbol === 'Numbers' || symbol === 'Letters' ? '*' : symbol;

  switch (pattern) {
    case 'PYRAMID_HALF':
      if (language === 'Java') {
        return `public class RightPyramid {
    public static void main(String[] args) {
        int rows = ${rows};
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(${getSymbolExpression('Java', 'j')});
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
for i in range(1, rows + 1):
    for j in range(1, i + 1):
        print(${getSymbolExpression('Python', 'j')}, end="")
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            cout << ${getSymbolExpression('C++', 'j')};
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            printf(${getSymbolExpression('C', 'j')});
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
for (let i = 1; i <= rows; i++) {
    let rowStr = "";
    for (let j = 1; j <= i; j++) {
        rowStr += \`${getSymbolExpression('JavaScript', 'j')}\`;
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'PYRAMID_INVERTED':
      if (language === 'Java') {
        return `public class InvertedRightPyramid {
    public static void main(String[] args) {
        int rows = ${rows};
        for (int i = rows; i >= 1; i--) {
            for (int j = 1; j <= i; j++) {
                System.out.print(${getSymbolExpression('Java', 'j')});
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
for i in range(rows, 0, -1):
    for j in range(1, i + 1):
        print(${getSymbolExpression('Python', 'j')}, end="")
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    for (int i = rows; i >= 1; i--) {
        for (int j = 1; j <= i; j++) {
            cout << ${getSymbolExpression('C++', 'j')};
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    for (int i = rows; i >= 1; i--) {
        for (int j = 1; j <= i; j++) {
            printf(${getSymbolExpression('C', 'j')});
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
for (let i = rows; i >= 1; i--) {
    let rowStr = "";
    for (let j = 1; j <= i; j++) {
        rowStr += \`${getSymbolExpression('JavaScript', 'j')}\`;
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'PYRAMID_FULL':
      if (language === 'Java') {
        return `public class FullPyramid {
    public static void main(String[] args) {
        int rows = ${rows};
        for (int i = 1; i <= rows; i++) {
            // Print leading spaces
            for (int s = 1; s <= rows - i; s++) {
                System.out.print(" ");
            }
            // Print characters
            for (int c = 1; c <= (2 * i - 1); c++) {
                System.out.print(${getSymbolExprWithoutSpace('Java', 'c')});
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
for i in range(1, rows + 1):
    # Print leading spaces
    print(" " * (rows - i), end="")
    # Print characters
    for c in range(1, (2 * i - 1) + 1):
        print(${getSymbolExprWithoutSpace('Python', 'c')}, end="")
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        for (int s = 1; s <= rows - i; s++) {
            cout << " ";
        }
        for (int c = 1; c <= (2 * i - 1); c++) {
            cout << ${getSymbolExprWithoutSpace('C++', 'c')};
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        for (int s = 1; s <= rows - i; s++) {
            printf(" ");
        }
        for (int c = 1; c <= (2 * i - 1); c++) {
            printf(${getSymbolExprWithoutSpace('C', 'c')});
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
for (let i = 1; i <= rows; i++) {
    let rowStr = " ".repeat(rows - i);
    for (let c = 1; c <= (2 * i - 1); c++) {
        rowStr += \`${getSymbolExprWithoutSpace('JavaScript', 'c')}\`;
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'PYRAMID_FULL_INV':
      if (language === 'Java') {
        return `public class InvertedFullPyramid {
    public static void main(String[] args) {
        int rows = ${rows};
        for (int i = rows; i >= 1; i--) {
            // Print leading spaces
            for (int s = 1; s <= rows - i; s++) {
                System.out.print(" ");
            }
            // Print characters
            for (int c = 1; c <= (2 * i - 1); c++) {
                System.out.print(${getSymbolExprWithoutSpace('Java', 'c')});
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
for i in range(rows, 0, -1):
    # Print leading spaces
    print(" " * (rows - i), end="")
    # Print characters
    for c in range(1, (2 * i - 1) + 1):
        print(${getSymbolExprWithoutSpace('Python', 'c')}, end="")
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    for (int i = rows; i >= 1; i--) {
        for (int s = 1; s <= rows - i; s++) {
            cout << " ";
        }
        for (int c = 1; c <= (2 * i - 1); c++) {
            cout << ${getSymbolExprWithoutSpace('C++', 'c')};
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    for (int i = rows; i >= 1; i--) {
        for (int s = 1; s <= rows - i; s++) {
            printf(" ");
        }
        for (int c = 1; c <= (2 * i - 1); c++) {
            printf(${getSymbolExprWithoutSpace('C', 'c')});
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
for (let i = rows; i >= 1; i--) {
    let rowStr = " ".repeat(rows - i);
    for (let c = 1; c <= (2 * i - 1); c++) {
        rowStr += \`${getSymbolExprWithoutSpace('JavaScript', 'c')}\`;
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'DIAMOND':
      if (language === 'Java') {
        return `public class DiamondPattern {
    public static void main(String[] args) {
        int rows = ${rows};
        // Top half
        for (int i = 1; i <= rows; i++) {
            for (int s = 1; s <= rows - i; s++) System.out.print(" ");
            for (int c = 1; c <= (2 * i - 1); c++) {
                System.out.print(${getSymbolExprWithoutSpace('Java', 'c')});
            }
            System.out.println();
        }
        // Bottom half
        for (int i = rows - 1; i >= 1; i--) {
            for (int s = 1; s <= rows - i; s++) System.out.print(" ");
            for (int c = 1; c <= (2 * i - 1); c++) {
                System.out.print(${getSymbolExprWithoutSpace('Java', 'c')});
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
# Top half
for i in range(1, rows + 1):
    print(" " * (rows - i), end="")
    for c in range(1, (2 * i - 1) + 1):
        print(${getSymbolExprWithoutSpace('Python', 'c')}, end="")
    print()
# Bottom half
for i in range(rows - 1, 0, -1):
    print(" " * (rows - i), end="")
    for c in range(1, (2 * i - 1) + 1):
        print(${getSymbolExprWithoutSpace('Python', 'c')}, end="")
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    // Top half
    for (int i = 1; i <= rows; i++) {
        for (int s = 1; s <= rows - i; s++) cout << " ";
        for (int c = 1; c <= (2 * i - 1); c++) {
            cout << ${getSymbolExprWithoutSpace('C++', 'c')};
        }
        cout << endl;
    }
    // Bottom half
    for (int i = rows - 1; i >= 1; i--) {
        for (int s = 1; s <= rows - i; s++) cout << " ";
        for (int c = 1; c <= (2 * i - 1); c++) {
            cout << ${getSymbolExprWithoutSpace('C++', 'c')};
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    // Top half
    for (int i = 1; i <= rows; i++) {
        for (int s = 1; s <= rows - i; s++) printf(" ");
        for (int c = 1; c <= (2 * i - 1); c++) {
            printf(${getSymbolExprWithoutSpace('C', 'c')});
        }
        printf("\\n");
    }
    // Bottom half
    for (int i = rows - 1; i >= 1; i--) {
        for (int s = 1; s <= rows - i; s++) printf(" ");
        for (int c = 1; c <= (2 * i - 1); c++) {
            printf(${getSymbolExprWithoutSpace('C', 'c')});
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
// Top half
for (let i = 1; i <= rows; i++) {
    let rowStr = " ".repeat(rows - i);
    for (let c = 1; c <= (2 * i - 1); c++) {
        rowStr += \`${getSymbolExprWithoutSpace('JavaScript', 'c')}\`;
    }
    console.log(rowStr);
}
// Bottom half
for (let i = rows - 1; i >= 1; i--) {
    let rowStr = " ".repeat(rows - i);
    for (let c = 1; c <= (2 * i - 1); c++) {
        rowStr += \`${getSymbolExprWithoutSpace('JavaScript', 'c')}\`;
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'FLOYD':
      if (language === 'Java') {
        return `public class FloydTriangle {
    public static void main(String[] args) {
        int rows = ${rows};
        int num = 1;
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(num + " ");
                num++;
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
num = 1
for i in range(1, rows + 1):
    for j in range(1, i + 1):
        print(f"{num} ", end="")
        num += 1
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    int num = 1;
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            cout << num << " ";
            num++;
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    int num = 1;
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d ", num);
            num++;
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
let num = 1;
for (let i = 1; i <= rows; i++) {
    let rowStr = "";
    for (let j = 1; j <= i; j++) {
        rowStr += num + " ";
        num++;
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'PASCAL':
      if (language === 'Java') {
        return `public class PascalTriangle {
    public static void main(String[] args) {
        int rows = ${rows};
        for (int i = 0; i < rows; i++) {
            // Spaces
            for (int s = 1; s <= rows - i - 1; s++) {
                System.out.print(" ");
            }
            int val = 1;
            for (int c = 0; c <= i; c++) {
                System.out.print(val + " ");
                val = val * (i - c) / (c + 1);
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
for i in range(0, rows):
    # Spaces
    print(" " * (rows - i - 1), end="")
    val = 1
    for c in range(0, i + 1):
        print(f"{val} ", end="")
        val = int(val * (i - c) / (c + 1))
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    for (int i = 0; i < rows; i++) {
        for (int s = 1; s <= rows - i - 1; s++) {
            cout << " ";
        }
        int val = 1;
        for (int c = 0; c <= i; c++) {
            cout << val << " ";
            val = val * (i - c) / (c + 1);
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    for (int i = 0; i < rows; i++) {
        for (int s = 1; s <= rows - i - 1; s++) {
            printf(" ");
        }
        int val = 1;
        for (int c = 0; c <= i; c++) {
            printf("%d ", val);
            val = val * (i - c) / (c + 1);
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
for (let i = 0; i < rows; i++) {
    let rowStr = " ".repeat(rows - i - 1);
    let val = 1;
    for (let c = 0; c <= i; c++) {
        rowStr += val + " ";
        val = Math.floor(val * (i - c) / (c + 1));
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'HOLLOW_SQUARE':
      if (language === 'Java') {
        return `public class HollowSquare {
    public static void main(String[] args) {
        int rows = ${rows};
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= rows; j++) {
                boolean isBorder = i == 1 || i == rows || j == 1 || j == rows || i == j || (i + j == rows + 1);
                if (isBorder) {
                    System.out.print(${getSymbolExprWithoutSpace('Java', 'j')} + " ");
                } else {
                    System.out.print("  ");
                }
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
for i in range(1, rows + 1):
    for j in range(1, rows + 1):
        is_border = i == 1 or i == rows or j == 1 or j == rows or i == j or (i + j == rows + 1)
        if is_border:
            print(${getSymbolExprWithoutSpace('Python', 'j')} + " ", end="")
        else:
            print("  ", end="")
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= rows; j++) {
            bool isBorder = i == 1 || i == rows || j == 1 || j == rows || i == j || (i + j == rows + 1);
            if (isBorder) {
                cout << ${getSymbolExprWithoutSpace('C++', 'j')} << " ";
            } else {
                cout << "  ";
            }
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= rows; j++) {
            int isBorder = i == 1 || i == rows || j == 1 || j == rows || i == j || (i + j == rows + 1);
            if (isBorder) {
                printf(${getSymbolExprWithoutSpace('C', 'j')});
                printf(" ");
            } else {
                printf("  ");
            }
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
for (let i = 1; i <= rows; i++) {
    let rowStr = "";
    for (let j = 1; j <= rows; j++) {
        const isBorder = i === 1 || i === rows || j === 1 || j === rows || i === j || (i + j === rows + 1);
        if (isBorder) {
            rowStr += \`${getSymbolExprWithoutSpace('JavaScript', 'j')} \`;
        } else {
            rowStr += "  ";
        }
    }
    console.log(rowStr);
}`;
      }
      break;

    case 'BUTTERFLY':
      if (language === 'Java') {
        return `public class ButterflyPattern {
    public static void main(String[] args) {
        int rows = ${rows};
        // Top wings
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) System.out.print("${rawSym}");
            for (int s = 1; s <= 2 * (rows - i); s++) System.out.print(" ");
            for (int j = 1; j <= i; j++) System.out.print("${rawSym}");
            System.out.println();
        }
        // Bottom wings
        for (int i = rows; i >= 1; i--) {
            for (int j = 1; j <= i; j++) System.out.print("${rawSym}");
            for (int s = 1; s <= 2 * (rows - i); s++) System.out.print(" ");
            for (int j = 1; j <= i; j++) System.out.print("${rawSym}");
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
# Top wings
for i in range(1, rows + 1):
    print("${rawSym}" * i + " " * (2 * (rows - i)) + "${rawSym}" * i)
# Bottom wings
for i in range(rows, 0, -1):
    print("${rawSym}" * i + " " * (2 * (rows - i)) + "${rawSym}" * i)`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    // Top wings
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) cout << "${rawSym}";
        for (int s = 1; s <= 2 * (rows - i); s++) cout << " ";
        for (int j = 1; j <= i; j++) cout << "${rawSym}";
        cout << endl;
    }
    // Bottom wings
    for (int i = rows; i >= 1; i--) {
        for (int j = 1; j <= i; j++) cout << "${rawSym}";
        for (int s = 1; s <= 2 * (rows - i); s++) cout << " ";
        for (int j = 1; j <= i; j++) cout << "${rawSym}";
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    // Top wings
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) printf("${rawSym}");
        for (int s = 1; s <= 2 * (rows - i); s++) printf(" ");
        for (int j = 1; j <= i; j++) printf("${rawSym}");
        printf("\\n");
    }
    // Bottom wings
    for (int i = rows; i >= 1; i--) {
        for (int j = 1; j <= i; j++) printf("${rawSym}");
        for (int s = 1; s <= 2 * (rows - i); s++) printf(" ");
        for (int j = 1; j <= i; j++) printf("${rawSym}");
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
// Top wings
for (let i = 1; i <= rows; i++) {
    console.log("${rawSym}".repeat(i) + " ".repeat(2 * (rows - i)) + "${rawSym}".repeat(i));
}
// Bottom wings
for (let i = rows; i >= 1; i--) {
    console.log("${rawSym}".repeat(i) + " ".repeat(2 * (rows - i)) + "${rawSym}".repeat(i));
}`;
      }
      break;

    case 'BINARY_TRIANGLE':
      if (language === 'Java') {
        return `public class BinaryTriangle {
    public static void main(String[] args) {
        int rows = ${rows};
        for (int i = 1; i <= rows; i++) {
            int val = (i % 2 == 1) ? 1 : 0;
            for (int j = 1; j <= i; j++) {
                System.out.print(val + " ");
                val = 1 - val;
            }
            System.out.println();
        }
    }
}`;
      }
      if (language === 'Python') {
        return `rows = ${rows}
for i in range(1, rows + 1):
    val = 1 if i % 2 == 1 else 0
    for j in range(1, i + 1):
        print(f"{val} ", end="")
        val = 1 - val
    print()`;
      }
      if (language === 'C++') {
        return `#include <iostream>
using namespace std;

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        int val = (i % 2 == 1) ? 1 : 0;
        for (int j = 1; j <= i; j++) {
            cout << val << " ";
            val = 1 - val;
        }
        cout << endl;
    }
    return 0;
}`;
      }
      if (language === 'C') {
        return `#include <stdio.h>

int main() {
    int rows = ${rows};
    for (int i = 1; i <= rows; i++) {
        int val = (i % 2 == 1) ? 1 : 0;
        for (int j = 1; j <= i; j++) {
            printf("%d ", val);
            val = 1 - val;
        }
        printf("\\n");
    }
    return 0;
}`;
      }
      if (language === 'JavaScript') {
        return `const rows = ${rows};
for (let i = 1; i <= rows; i++) {
    let rowStr = "";
    let val = (i % 2 === 1) ? 1 : 0;
    for (let j = 1; j <= i; j++) {
        rowStr += val + " ";
        val = 1 - val;
    }
    console.log(rowStr);
}`;
      }
      break;

    default:
      return '';
  }
};
