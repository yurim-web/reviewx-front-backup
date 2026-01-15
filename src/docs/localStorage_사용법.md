# 📦 localStorage 사용법 (간단 정리)

## 🎯 localStorage란?

브라우저에 데이터를 저장하는 저장소입니다. 페이지를 새로고침해도 데이터가 유지됩니다.

---

## 📝 기본 사용법

### 1️⃣ 데이터 저장하기

```typescript
// 문자열 저장
localStorage.setItem("이름", "홍길동");

// 객체 저장 (JSON으로 변환 필요)
const user = { name: "홍길동", age: 30 };
localStorage.setItem("user", JSON.stringify(user));
```

### 2️⃣ 데이터 가져오기

```typescript
// 문자열 가져오기
const name = localStorage.getItem("이름"); // "홍길동"

// 객체 가져오기 (JSON으로 변환 필요)
const stored = localStorage.getItem("user");
const user = stored ? JSON.parse(stored) : null;
```

### 3️⃣ 데이터 삭제하기

```typescript
localStorage.removeItem("이름"); // 특정 키 삭제
localStorage.clear(); // 전체 삭제
```

---

## ⚛️ React에서 사용하기

### ✅ 읽기 (useEffect 사용)

```typescript
import { useState, useEffect } from "react";

export default function MyComponent() {
  const [data, setData] = useState("");

  // 컴포넌트가 처음 로드될 때 실행
  useEffect(() => {
    // Next.js SSR 체크 (필수!)
    if (typeof window === "undefined") return;

    // localStorage에서 가져오기
    const stored = localStorage.getItem("키");
    if (stored) {
      setData(JSON.parse(stored)); // 객체인 경우
      // setData(stored); // 문자열인 경우
    }
  }, []); // 빈 배열 = 한 번만 실행
}
```

### ✅ 저장하기

```typescript
// 방법 1: 버튼 클릭 시 저장
const handleSave = () => {
  localStorage.setItem("키", JSON.stringify(data));
};

// 방법 2: 데이터 변경 시 자동 저장
useEffect(() => {
  if (typeof window === "undefined") return;
  localStorage.setItem("키", JSON.stringify(data));
}, [data]); // data가 변경될 때마다 저장
```

---

## 💡 실전 예시

```typescript
"use client";

import { useState, useEffect } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);

  // 1. 읽기: 컴포넌트 로드 시 localStorage에서 가져오기
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  // 2. 저장하기: todos가 변경될 때마다 자동 저장
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    setTodos([...todos, text]);
  };

  return <div>{/* TODO 리스트 */}</div>;
}
```

---

## ⚠️ 주의사항

1. **SSR 체크 필수**: `if (typeof window === "undefined") return;`
2. **객체는 JSON 변환**: `JSON.stringify()`로 저장, `JSON.parse()`로 읽기
3. **에러 처리**: `try-catch`로 감싸기
4. **useEffect 의존성 배열**: 읽기는 `[]`, 저장은 `[데이터]`

---

## 📌 핵심 정리

| 작업        | 사용하는 훅                    | 언제 사용?                       |
| ----------- | ------------------------------ | -------------------------------- |
| **읽기**    | `useEffect`                    | 컴포넌트 마운트 시 (한 번)       |
| **저장**    | `useEffect` 또는 이벤트 핸들러 | 데이터 변경 시 또는 버튼 클릭 시 |
| **useMemo** | ❌ 사용 안 함                  | localStorage는 빠르므로 불필요   |

---

## 🎓 기억할 것

- ✅ **읽기**: `useEffect` + 빈 배열 `[]`
- ✅ **저장**: `useEffect` + 의존성 배열 `[데이터]` 또는 이벤트 핸들러
- ✅ **SSR 체크**: `if (typeof window === "undefined") return;` 필수!
- ✅ **객체 저장**: `JSON.stringify()` / `JSON.parse()` 사용
