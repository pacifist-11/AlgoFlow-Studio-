export const getSortSearchCode = (algo, lang, arr, target) => {
  const arrStr = arr.join(', ');
  let execBlock = '';
  
  if (lang === 'C++') {
    execBlock = `    int arr[] = {${arrStr}};\n    int n = sizeof(arr)/sizeof(arr[0]);\n`;
    if (target !== undefined) execBlock += `    int target = ${target};\n`;
  } else if (lang === 'Java') {
    execBlock = `        int[] arr = {${arrStr}};\n`;
    if (target !== undefined) execBlock += `        int target = ${target};\n`;
  } else if (lang === 'Python') {
    execBlock = `    arr = [${arrStr}]\n`;
    if (target !== undefined) execBlock += `    target = ${target}\n`;
  } else {
    execBlock = `  let arr = [${arrStr}];\n`;
    if (target !== undefined) execBlock += `  let target = ${target};\n`;
  }

  // C++ Templates
  if (lang === 'C++') {
    if (algo === 'Bubble Sort') return `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
}

int main() {
${execBlock}    bubbleSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Selection Sort') return `#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}

int main() {
${execBlock}    selectionSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Insertion Sort') return `#include <iostream>
using namespace std;

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
${execBlock}    insertionSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Merge Sort') return `#include <iostream>
using namespace std;

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

int main() {
${execBlock}    mergeSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Heap Sort') return `#include <iostream>
using namespace std;

void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

int main() {
${execBlock}    heapSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Shell Sort') return `#include <iostream>
using namespace std;

void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                arr[j] = arr[j - gap];
            arr[j] = temp;
        }
    }
}

int main() {
${execBlock}    shellSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Cocktail Shaker Sort') return `#include <iostream>
using namespace std;

void cocktailSort(int arr[], int n) {
    bool swapped = true;
    int start = 0, end = n - 1;
    while (swapped) {
        swapped = false;
        for (int i = start; i < end; ++i) {
            if (arr[i] > arr[i + 1]) {
                swap(arr[i], arr[i + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
        swapped = false;
        --end;
        for (int i = end - 1; i >= start; --i) {
            if (arr[i] > arr[i + 1]) {
                swap(arr[i], arr[i + 1]);
                swapped = true;
            }
        }
        ++start;
    }
}

int main() {
${execBlock}    cocktailSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Quick Sort') return `#include <iostream>
using namespace std;

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

${execBlock}    quickSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Radix Sort') return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int getMax(int arr[], int n) {
    int mx = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > mx) mx = arr[i];
    return mx;
}

void countSort(int arr[], int n, int exp) {
    int output[n];
    int i, count[10] = {0};
    for (i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
    for (i = 1; i < 10; i++) count[i] += count[i - 1];
    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    for (i = 0; i < n; i++) arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}

int main() {
${execBlock}    radixSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Counting Sort') return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void countingSort(int arr[], int n) {
    if (n <= 0) return;
    int maxVal = arr[0];
    int minVal = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > maxVal) maxVal = arr[i];
        if (arr[i] < minVal) minVal = arr[i];
    }
    int range = maxVal - minVal + 1;
    vector<int> count(range, 0);
    vector<int> output(n);
    for (int i = 0; i < n; i++) count[arr[i] - minVal]++;
    for (int i = 1; i < range; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - minVal] - 1] = arr[i];
        count[arr[i] - minVal]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
}

int main() {
${execBlock}    countingSort(arr, n);
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    return 0;
}`;

    if (algo === 'Linear Search') return `#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (arr[i] == x) return i;
    return -1;
}

int main() {
${execBlock}    int res = linearSearch(arr, n, target);
    if (res == -1) cout << "Not Found";
    else cout << "Found at index " << res;
    return 0;
}`;

    if (algo === 'Binary Search') return `#include <iostream>
#include <algorithm>
using namespace std;

int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

int main() {
${execBlock}    // Array must be sorted for Binary Search
    sort(arr, arr + n);
    int res = binarySearch(arr, 0, n - 1, target);
    if (res == -1) cout << "Not Found";
    else cout << "Found at index " << res;
    return 0;
}`;
  }

  // Java Templates
  if (lang === 'Java') {
    if (algo === 'Bubble Sort') return `import java.util.Arrays;

public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }
    public static void main(String[] args) {
${execBlock}        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Selection Sort') return `import java.util.Arrays;

public class Main {
    static void selectionSort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++)
                if (arr[j] < arr[min_idx]) min_idx = j;
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }
    public static void main(String[] args) {
${execBlock}        selectionSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Insertion Sort') return `import java.util.Arrays;

public class Main {
    static void insertionSort(int arr[]) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
    public static void main(String[] args) {
${execBlock}        insertionSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Merge Sort') return `import java.util.Arrays;

public class Main {
    static void merge(int arr[], int l, int m, int r) {
        int n1 = m - l + 1, n2 = r - m;
        int L[] = new int[n1], R[] = new int[n2];
        for (int i = 0; i < n1; i++) L[i] = arr[l + i];
        for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) { arr[k] = L[i]; i++; }
            else { arr[k] = R[j]; j++; }
            k++;
        }
        while (i < n1) { arr[k] = L[i]; i++; k++; }
        while (j < n2) { arr[k] = R[j]; j++; k++; }
    }
    static void sort(int arr[], int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
    public static void main(String[] args) {
${execBlock}        sort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Heap Sort') return `import java.util.Arrays;

public class Main {
    public void sort(int arr[]) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            heapify(arr, i, 0);
        }
    }
    void heapify(int arr[], int n, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest != i) {
            int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;
            heapify(arr, n, largest);
        }
    }
    public static void main(String[] args) {
${execBlock}        new Main().sort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Shell Sort') return `import java.util.Arrays;

public class Main {
    int sort(int arr[]) {
        int n = arr.length;
        for (int gap = n/2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i += 1) {
                int temp = arr[i];
                int j;
                for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                    arr[j] = arr[j - gap];
                arr[j] = temp;
            }
        }
        return 0;
    }
    public static void main(String[] args) {
${execBlock}        new Main().sort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Cocktail Shaker Sort') return `import java.util.Arrays;

public class Main {
    static void cocktailSort(int a[]) {
        boolean swapped = true;
        int start = 0, end = a.length;
        while (swapped) {
            swapped = false;
            for (int i = start; i < end - 1; ++i) {
                if (a[i] > a[i + 1]) {
                    int temp = a[i]; a[i] = a[i + 1]; a[i + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
            swapped = false;
            end = end - 1;
            for (int i = end - 1; i >= start; i--) {
                if (a[i] > a[i + 1]) {
                    int temp = a[i]; a[i] = a[i + 1]; a[i + 1] = temp;
                    swapped = true;
                }
            }
            start = start + 1;
        }
    }
    public static void main(String[] args) {
${execBlock}        cocktailSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Quick Sort') return `import java.util.Arrays;

public class Main {
    static int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
    static void sort(int arr[], int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
${execBlock}        sort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Radix Sort') return `import java.util.Arrays;

public class Main {
    static int getMax(int arr[], int n) {
        int mx = arr[0];
        for (int i = 1; i < n; i++)
            if (arr[i] > mx) mx = arr[i];
        return mx;
    }

    static void countSort(int arr[], int n, int exp) {
        int output[] = new int[n];
        int i;
        int count[] = new int[10];
        Arrays.fill(count, 0);

        for (i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
        for (i = 1; i < 10; i++) count[i] += count[i - 1];
        for (i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }
        for (i = 0; i < n; i++) arr[i] = output[i];
    }

    static void radixSort(int arr[], int n) {
        int m = getMax(arr, n);
        for (int exp = 1; m / exp > 0; exp *= 10)
            countSort(arr, n, exp);
    }

    public static void main(String[] args) {
${execBlock}        radixSort(arr, arr.length);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Counting Sort') return `import java.util.Arrays;

public class Main {
    static void countingSort(int[] arr) {
        int n = arr.length;
        if (n <= 0) return;
        int maxVal = arr[0];
        int minVal = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] > maxVal) maxVal = arr[i];
            if (arr[i] < minVal) minVal = arr[i];
        }
        int range = maxVal - minVal + 1;
        int[] count = new int[range];
        int[] output = new int[n];
        for (int i = 0; i < n; i++) count[arr[i] - minVal]++;
        for (int i = 1; i < range; i++) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            output[count[arr[i] - minVal] - 1] = arr[i];
            count[arr[i] - minVal]--;
        }
        for (int i = 0; i < n; i++) arr[i] = output[i];
    }
    public static void main(String[] args) {
${execBlock}        countingSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`;

    if (algo === 'Linear Search') return `public class Main {
    static int search(int arr[], int x) {
        int n = arr.length;
        for (int i = 0; i < n; i++)
            if (arr[i] == x) return i;
        return -1;
    }
    public static void main(String[] args) {
${execBlock}        int result = search(arr, target);
        if (result == -1) System.out.print("Not found");
        else System.out.print("Found at index " + result);
    }
}`;

    if (algo === 'Binary Search') return `import java.util.Arrays;

public class Main {
    static int binarySearch(int arr[], int x) {
        int l = 0, r = arr.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (arr[m] == x) return m;
            if (arr[m] < x) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
${execBlock}        // Array must be sorted
        Arrays.sort(arr);
        int result = binarySearch(arr, target);
        if (result == -1) System.out.println("Not found");
        else System.out.println("Found at index " + result);
    }
}`;
  }

  // Python Templates
  if (lang === 'Python') {
    if (algo === 'Bubble Sort') return `def bubbleSort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(0, n-i-1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

if __name__ == "__main__":
${execBlock}    bubbleSort(arr)
    print(arr)`;

    if (algo === 'Selection Sort') return `def selectionSort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

if __name__ == "__main__":
${execBlock}    selectionSort(arr)
    print(arr)`;

    if (algo === 'Insertion Sort') return `def insertionSort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

if __name__ == "__main__":
${execBlock}    insertionSort(arr)
    print(arr)`;

    if (algo === 'Merge Sort') return `def mergeSort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        mergeSort(L)
        mergeSort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1

if __name__ == "__main__":
${execBlock}    mergeSort(arr)
    print(arr)`;

    if (algo === 'Heap Sort') return `def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[i] < arr[l]: largest = l
    if r < n and arr[largest] < arr[r]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heapSort(arr):
    n = len(arr)
    for i in range(n//2 - 1, -1, -1): heapify(arr, n, i)
    for i in range(n-1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)

if __name__ == "__main__":
${execBlock}    heapSort(arr)
    print(arr)`;

    if (algo === 'Shell Sort') return `def shellSort(arr):
    n = len(arr)
    gap = n//2
    while gap > 0:
        for i in range(gap,n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j-gap] > temp:
                arr[j] = arr[j-gap]
                j -= gap
            arr[j] = temp
        gap //= 2

if __name__ == "__main__":
${execBlock}    shellSort(arr)
    print(arr)`;

    if (algo === 'Cocktail Shaker Sort') return `def cocktailSort(a):
    n = len(a)
    swapped = True
    start = 0
    end = n-1
    while (swapped == True):
        swapped = False
        for i in range (start, end):
            if (a[i] > a[i + 1]) :
                a[i], a[i + 1]= a[i + 1], a[i]
                swapped = True
        if (swapped == False): break
        swapped = False
        end = end-1
        for i in range(end-1, start-1, -1):
            if (a[i] > a[i + 1]):
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True
        start = start + 1

if __name__ == "__main__":
${execBlock}    cocktailSort(arr)
    print(arr)`;

    if (algo === 'Quick Sort') return `def partition(array, low, high):
    pivot = array[high]
    i = low - 1
    for j in range(low, high):
        if array[j] <= pivot:
            i = i + 1
            (array[i], array[j]) = (array[j], array[i])
    (array[i + 1], array[high]) = (array[high], array[i + 1])
    return i + 1

def quickSort(array, low, high):
    if low < high:
        pi = partition(array, low, high)
        quickSort(array, low, pi - 1)
        quickSort(array, pi + 1, high)

if __name__ == "__main__":
${execBlock}    quickSort(arr, 0, len(arr) - 1)
    print(arr)`;

    if (algo === 'Radix Sort') return `def countingSort(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10

    for i in range(0, n):
        index = arr[i] // exp
        count[index % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
    for i in range(0, len(arr)):
        arr[i] = output[i]

def radixSort(arr):
    max1 = max(arr)
    exp = 1
    while max1 // exp > 0:
        countingSort(arr, exp)
        exp *= 10

if __name__ == "__main__":
${execBlock}    radixSort(arr)
    print(arr)`;

    if (algo === 'Counting Sort') return `def countingSort(arr):
    n = len(arr)
    if n <= 0: return arr
    maxVal = max(arr)
    minVal = min(arr)
    rangeVal = maxVal - minVal + 1
    count = [0] * rangeVal
    output = [0] * n
    for i in range(0, n):
        count[arr[i] - minVal] += 1
    for i in range(1, rangeVal):
        count[i] += count[i - 1]
    i = n - 1
    while i >= 0:
        output[count[arr[i] - minVal] - 1] = arr[i]
        count[arr[i] - minVal] -= 1
        i -= 1
    for i in range(0, n):
        arr[i] = output[i]
    return arr

if __name__ == "__main__":
${execBlock}    countingSort(arr)
    print(arr)`;

    if (algo === 'Linear Search') return `def search(arr, n, x):
    for i in range(0, n):
        if (arr[i] == x): return i
    return -1

if __name__ == "__main__":
${execBlock}    result = search(arr, len(arr), target)
    if result == -1: print("Not found")
    else: print("Found at index", result)`;

    if (algo === 'Binary Search') return `def binarySearch(arr, l, r, x):
    while l <= r:
        mid = l + (r - l) // 2
        if arr[mid] == x: return mid
        elif arr[mid] < x: l = mid + 1
        else: r = mid - 1
    return -1

if __name__ == "__main__":
${execBlock}    # Array must be sorted
    arr.sort()
    result = binarySearch(arr, 0, len(arr)-1, target)
    if result == -1: print("Not found")
    else: print("Found at index", result)`;
  }

  // JS Templates
  if (lang === 'JS') {
    if (algo === 'Bubble Sort') return `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

${execBlock}bubbleSort(arr);
console.log(arr);`;

    if (algo === 'Selection Sort') return `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min_idx = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[min_idx]) min_idx = j;
    let temp = arr[min_idx];
    arr[min_idx] = arr[i];
    arr[i] = temp;
  }
}

${execBlock}selectionSort(arr);
console.log(arr);`;

    if (algo === 'Insertion Sort') return `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}

${execBlock}insertionSort(arr);
console.log(arr);`;

    if (algo === 'Merge Sort') return `function merge(arr, l, m, r) {
  let n1 = m - l + 1, n2 = r - m;
  let L = new Array(n1), R = new Array(n2);
  for (let i = 0; i < n1; i++) L[i] = arr[l + i];
  for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) { arr[k] = L[i]; i++; }
    else { arr[k] = R[j]; j++; }
    k++;
  }
  while (i < n1) { arr[k] = L[i]; i++; k++; }
  while (j < n2) { arr[k] = R[j]; j++; k++; }
}

function mergeSort(arr, l, r) {
  if (l >= r) return;
  let m = l + Math.floor((r - l) / 2);
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}

${execBlock}mergeSort(arr, 0, arr.length - 1);
console.log(arr);`;

    if (algo === 'Heap Sort') return `function heapify(arr, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    let swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
    heapify(arr, i, 0);
  }
}

${execBlock}heapSort(arr);
console.log(arr);`;

    if (algo === 'Shell Sort') return `function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    for (let i = gap; i < n; i += 1) {
      let temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
        arr[j] = arr[j - gap];
      arr[j] = temp;
    }
  }
}

${execBlock}shellSort(arr);
console.log(arr);`;

    if (algo === 'Cocktail Shaker Sort') return `function cocktailSort(a) {
  let swapped = true;
  let start = 0, end = a.length;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end - 1; ++i) {
      if (a[i] > a[i + 1]) {
        let temp = a[i]; a[i] = a[i + 1]; a[i + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    end = end - 1;
    for (let i = end - 1; i >= start; i--) {
      if (a[i] > a[i + 1]) {
        let temp = a[i]; a[i] = a[i + 1]; a[i + 1] = temp;
        swapped = true;
      }
    }
    start = start + 1;
  }
}

${execBlock}cocktailSort(arr);
console.log(arr);`;

    if (algo === 'Quick Sort') return `function partition(arr, low, high) {
  let pivot = arr[high];
  let i = (low - 1);
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
  }
  let temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
  return (i + 1);
}

function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

${execBlock}quickSort(arr, 0, arr.length - 1);
console.log(arr);`;

    if (algo === 'Radix Sort') return `function getMax(arr, n) {
  let mx = arr[0];
  for (let i = 1; i < n; i++)
    if (arr[i] > mx) mx = arr[i];
  return mx;
}

function countSort(arr, n, exp) {
  let output = new Array(n);
  let count = new Array(10).fill(0);
  let i;

  for (i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
  for (i = 1; i < 10; i++) count[i] += count[i - 1];
  for (i = n - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  for (i = 0; i < n; i++) arr[i] = output[i];
}

function radixSort(arr, n) {
  let m = getMax(arr, n);
  for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10)
    countSort(arr, n, exp);
}

${execBlock}radixSort(arr, arr.length);
console.log(arr);`;

    if (algo === 'Counting Sort') return `function countingSort(arr) {
  let n = arr.length;
  if (n <= 0) return arr;
  let maxVal = Math.max(...arr);
  let minVal = Math.min(...arr);
  let range = maxVal - minVal + 1;
  let count = new Array(range).fill(0);
  let output = new Array(n).fill(0);
  for (let i = 0; i < n; i++) count[arr[i] - minVal]++;
  for (let i = 1; i < range; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    output[count[arr[i] - minVal] - 1] = arr[i];
    count[arr[i] - minVal]--;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
  return arr;
}

${execBlock}countingSort(arr);
console.log(arr);`;

    if (algo === 'Linear Search') return `function search(arr, n, x) {
  for (let i = 0; i < n; i++)
    if (arr[i] == x) return i;
  return -1;
}

${execBlock}let result = search(arr, arr.length, target);
if (result == -1) console.log("Not found");
else console.log("Found at index " + result);`;

    if (algo === 'Binary Search') return `function binarySearch(arr, x) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    let m = l + Math.floor((r - l) / 2);
    if (arr[m] == x) return m;
    if (arr[m] < x) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

${execBlock}// Array must be sorted
arr.sort((a,b) => a-b);
let result = binarySearch(arr, target);
if (result == -1) console.log("Not found");
else console.log("Found at index " + result);`;
  }

  return `// Code generation for ${algo} in ${lang} is currently unavailable.\n// Please check back later!`;
};
