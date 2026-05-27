import LogoutButton from "../components/button/LogoutButton";
import ChildList from "../components/profile/ChildList";
import ProfileCard from "../components/profile/ProfileCard";
import TrustCard from "../components/profile/TrustCard";
import { usePerson } from "../service/PersonService";

export default function Profile() {
  const { data } = usePerson();
  console.log;
  return (
    <div className="w-full h-[932px] min-w-96 px-4 bg-white inline-flex flex-col justify-start items-center gap-5 overflow-hidden">
      {data ? (
        <>
          <ProfileCard person={data} />
          <TrustCard score={data.trustScore} />
          <ChildList children={data.children} />
          <LogoutButton />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
