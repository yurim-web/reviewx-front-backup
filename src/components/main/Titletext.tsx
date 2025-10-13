// 메인 페이지 제목 부분

import styles from "../../styles/home/text.module.css";

export default function Titletext({ main_title }: { main_title: string }) {
  return (
    <>
      <h1 className={styles.title_text}>{main_title}</h1>
    </>
  );
}
