import { useFormikContext } from "formik";

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "=120$";
  }
  return `=${price}€`;
};

function ExchangeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[32px] w-[32px] shrink-0"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 16.1C4 17.6 4.28333 19.0583 4.85 20.475C5.41667 21.8917 6.3 23.2 7.5 24.4L8 24.9V22C8 21.4333 8.19167 20.9583 8.575 20.575C8.95833 20.1917 9.43333 20 10 20C10.5667 20 11.0417 20.1917 11.425 20.575C11.8083 20.9583 12 21.4333 12 22V30C12 30.5667 11.8083 31.0417 11.425 31.425C11.0417 31.8083 10.5667 32 10 32H2C1.43333 32 0.958333 31.8083 0.575 31.425C0.191667 31.0417 0 30.5667 0 30C0 29.4333 0.191667 28.9583 0.575 28.575C0.958333 28.1917 1.43333 28 2 28H5.5L4.7 27.3C2.96667 25.7667 1.75 24.0167 1.05 22.05C0.35 20.0833 0 18.1 0 16.1C0 12.9667 0.8 10.125 2.4 7.575C4 5.025 6.15 3.06667 8.85 1.7C9.31667 1.43333 9.80833 1.41667 10.325 1.65C10.8417 1.88333 11.1833 2.26667 11.35 2.8C11.5167 3.3 11.5083 3.8 11.325 4.3C11.1417 4.8 10.8167 5.18333 10.35 5.45C8.41667 6.51667 6.875 7.99167 5.725 9.875C4.575 11.7583 4 13.8333 4 16.1ZM28 15.9C28 14.4 27.7167 12.9417 27.15 11.525C26.5833 10.1083 25.7 8.8 24.5 7.6L24 7.1V10C24 10.5667 23.8083 11.0417 23.425 11.425C23.0417 11.8083 22.5667 12 22 12C21.4333 12 20.9583 11.8083 20.575 11.425C20.1917 11.0417 20 10.5667 20 10V2C20 1.43333 20.1917 0.958333 20.575 0.575C20.9583 0.191667 21.4333 0 22 0H30C30.5667 0 31.0417 0.191667 31.425 0.575C31.8083 0.958333 32 1.43333 32 2C32 2.56667 31.8083 3.04167 31.425 3.425C31.0417 3.80833 30.5667 4 30 4H26.5L27.3 4.7C28.9333 6.33333 30.125 8.10833 30.875 10.025C31.625 11.9417 32 13.9 32 15.9C32 19.0333 31.2 21.875 29.6 24.425C28 26.975 25.85 28.9333 23.15 30.3C22.6833 30.5667 22.1917 30.5833 21.675 30.35C21.1583 30.1167 20.8167 29.7333 20.65 29.2C20.4833 28.7 20.4917 28.2 20.675 27.7C20.8583 27.2 21.1833 26.8167 21.65 26.55C23.5833 25.4833 25.125 24.0083 26.275 22.125C27.425 20.2417 28 18.1667 28 15.9Z"
        fill="#040037"
      />
    </svg>
  );
}

export default function TrocSpecificStep() {
  const { values } = useFormikContext();
  const proposedTitle = values.title || "MacLaren XT";
  const wantedArticle = values.wantedArticle || "Lit parapluie";
  const condition = values.condition || "Bon état";

  return (
    <div>
      <div className="mb-[20px] grid grid-cols-[minmax(0,1fr)_54px_minmax(0,1fr)] items-center gap-0">
        <article className="flex min-h-[152px] flex-col items-center justify-center rounded-xl bg-[#f4f3fb] px-[10px] py-[17px] text-center">
          <p className="text-[19px] font-extrabold leading-tight text-[#777388]">
            Vous proposez
          </p>
          <p className="mt-[22px] max-w-full break-words text-[18px] font-extrabold leading-tight text-[#2f2d3c]">
            {proposedTitle}
          </p>
          <p className="mt-[14px] text-[16px] font-medium leading-tight text-[#777388]">
            {formatPrice(values.estimatedPrice)}
          </p>
          <span className="mt-[12px] inline-flex max-w-full rounded-full border border-[#080036] bg-white px-[16px] py-[8px] text-[14px] font-medium leading-none text-[#080036]">
            {condition}
          </span>
        </article>

        <div className="flex items-center justify-center">
          <ExchangeIcon />
        </div>

        <article className="flex min-h-[152px] flex-col items-center justify-center rounded-xl bg-[#f4f3fb] px-[10px] py-[17px] text-center">
          <p className="text-[19px] font-extrabold leading-tight text-[#777388]">
            Vous cherchez
          </p>
          <p className="mt-[22px] max-w-full break-words text-[18px] font-extrabold leading-tight text-[#2f2d3c]">
            {wantedArticle}
          </p>
          <p className="mt-[14px] text-[16px] font-medium leading-tight text-[#777388]">
            =95$-130$
          </p>
          <span className="mt-[12px] inline-flex rounded-full border border-[#080036] bg-white px-[16px] py-[8px] text-[14px] font-medium leading-none text-[#080036]">
            Bon état
          </span>
        </article>
      </div>

      <h2 className="mb-[14px] text-[22px] font-extrabold leading-tight text-[#2f2d3c]">
        Matchs IA détectés
      </h2>

      <div className="space-y-[12px]">
        <button
          className="flex min-h-[82px] w-full items-center justify-between rounded-lg border-2 border-[#080036] bg-white px-[26px] py-[14px] text-left"
          type="button"
        >
          <span>
            <span className="block text-[20px] font-extrabold leading-tight text-[#080036]">
              Chicco Lullaby
            </span>
            <span className="mt-[9px] block text-[16px] font-medium text-[#2f2d3c]">
              94% · Sarah A.
            </span>
          </span>
          <span className="material-symbols-rounded text-[34px] text-[#16a34a]">
            check_circle
          </span>
        </button>

        <button
          className="min-h-[82px] w-full rounded-lg border border-[#858199] bg-white px-[26px] py-[14px] text-left"
          type="button"
        >
          <span className="block text-[20px] font-extrabold leading-tight text-[#080036]">
            Next2Me cododo
          </span>
          <span className="mt-[9px] block text-[16px] font-medium text-[#2f2d3c]">
            88% · Julie P.
          </span>
        </button>
      </div>

      <div className="mt-[25px] space-y-[22px]">
        {[
          "2 photos · IA identifiée",
          "Infos complètes",
          "Échange défini · Match 94%",
        ].map((item) => (
          <div className="flex items-center gap-[22px]" key={item}>
            <span className="material-symbols-rounded text-[36px] text-[#080036]">
              check_circle
            </span>
            <span className="text-[20px] font-extrabold leading-tight text-[#2f2d3c]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
