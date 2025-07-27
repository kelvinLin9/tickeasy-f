export default function PrecautionAndNeedtoKnow() {
  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <p className="text-lg font-semibold">注意事項</p>
        <p className="pl-4 text-sm/6">
          活動當天請憑電子票或紙本票入場，工作人員將進行驗票，未攜帶者不得入場。 為維護演出品質，場內禁止使用閃光燈拍照、錄影或直播。
          若遇不可抗力因素（如天災、疫情、政府法規等），主辦單位將保留延期或取消活動的權利，並依官方公告提供退票或更換場次的辦法。
          若有票務相關問題，請聯繫官方客服中心 （電子郵件：support@example.com，客服專線：0800-XXX-XXX）。
        </p>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <p className="text-lg font-semibold">購票須知</p>
        <p className="pl-4 text-sm/6">
          請注意，你應該先報名完成一筆訂單後再報名下一筆。為保障消費者權益及杜絕非法囤票，同一使用者同時間只能報名一筆訂單，透過多開視窗同時報名、購買多筆訂單，系統將只保留最後一筆訂單，取消先前尚未報名完成之訂單，敬請理解與配合。
        </p>
      </div>
      <div>
        <p>請於時限內完成購買資訊，否則視為放棄該購票權益</p>
        {/* <p className="text-destructive">
          剩餘時間: <strong>10:00</strong>
        </p> */}
      </div>
    </>
  );
}
