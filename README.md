# RetroTV Utils

JavaScript/TypeScript용 범용 유틸리티 라이브러리입니다.

## 설치

```bash
npm install @retrotv/file
```

## 사용법

### 문자열 유틸리티

```typescript
import { StringUtils } from '@retrotv/file';

// 첫 글자 대문자화
StringUtils.capitalize('hello world'); // "Hello world"

// 카멜케이스를 케밥케이스로
StringUtils.camelToKebab('helloWorld'); // "hello-world"

// 케밥케이스를 카멜케이스로
StringUtils.kebabToCamel('hello-world'); // "helloWorld"

// HTML 태그 제거
StringUtils.stripHtml('<p>Hello <b>world</b></p>'); // "Hello world"
```

### 배열 유틸리티

```typescript
import { ArrayUtils } from '@retrotv/file';

// 중복 제거
ArrayUtils.unique([1, 2, 2, 3, 3, 4]); // [1, 2, 3, 4]

// 배열 청크 분할
ArrayUtils.chunk([1, 2, 3, 4, 5, 6], 2); // [[1, 2], [3, 4], [5, 6]]

// 배열 섞기
ArrayUtils.shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (랜덤)
```

### 객체 유틸리티

```typescript
import { ObjectUtils } from '@your-username/retrotv-utils';

// 깊은 복사
const obj = { a: 1, b: { c: 2 } };
const cloned = ObjectUtils.deepClone(obj);

// 빈 값 제거
ObjectUtils.removeEmpty({ a: 1, b: '', c: null, d: undefined }); // { a: 1 }
```

### 날짜 유틸리티

```typescript
import { DateUtils } from '@your-username/retrotv-utils';

// 날짜 포맷
DateUtils.formatDate(new Date()); // "2025-07-16"

// 날짜 차이 계산
const date1 = new Date('2025-07-16');
const date2 = new Date('2025-07-20');
DateUtils.daysBetween(date1, date2); // 4

// 날짜에 일수 추가
DateUtils.addDays(new Date('2025-07-16'), 5); // 2025-07-21
```

### 기타 유틸리티

```typescript
import { delay, debounce, throttle } from '@your-username/retrotv-utils';

// 지연 실행
await delay(1000); // 1초 대기

// 디바운스
const debouncedFn = debounce(() => console.log('실행'), 300);

// 스로틀
const throttledFn = throttle(() => console.log('실행'), 1000);
```

## API 문서

### StringUtils
- `capitalize(str: string): string` - 첫 글자를 대문자로 변환
- `camelToKebab(str: string): string` - 카멜케이스를 케밥케이스로 변환
- `kebabToCamel(str: string): string` - 케밥케이스를 카멜케이스로 변환
- `stripHtml(str: string): string` - HTML 태그 제거

### ArrayUtils
- `unique<T>(arr: T[]): T[]` - 중복 제거
- `chunk<T>(arr: T[], size: number): T[][]` - 배열을 청크로 분할
- `shuffle<T>(arr: T[]): T[]` - 배열을 랜덤하게 섞기

### ObjectUtils
- `deepClone<T>(obj: T): T` - 깊은 복사
- `removeEmpty(obj: Record<string, any>): Record<string, any>` - 빈 값 제거

### DateUtils
- `formatDate(date: Date): string` - 날짜를 YYYY-MM-DD 형식으로 포맷
- `daysBetween(date1: Date, date2: Date): number` - 두 날짜 사이의 일수 계산
- `addDays(date: Date, days: number): Date` - 날짜에 일수 추가

### 기타 함수
- `delay(ms: number): Promise<void>` - 지연 실행
- `debounce<T>(func: T, wait: number): T` - 디바운스
- `throttle<T>(func: T, limit: number): T` - 스로틀

## 라이선스

MIT

## 기여하기

이슈나 풀 리퀘스트를 환영합니다!
