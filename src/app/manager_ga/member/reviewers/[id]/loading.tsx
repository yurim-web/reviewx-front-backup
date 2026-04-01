import Image from "next/image";
import styles from "@/styles/error_page/loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading_container}>
      <div className={styles.loading_content}>
        <div className={styles.loading_illustration}>
          <div className={styles.loading_container_wrapper}>
            <div className={styles.white_circle}>
              <Image
                src="/images/loading_icon.svg"
                alt="Loading"
                width={48}
                height={48}
                className={styles.loading_icon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
