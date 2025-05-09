import PageWrapper from "../../components/container/PageWrapper";
import { useSelector } from "react-redux";
import {
  selectProfile,
  selectProfileActiveRole,
} from "../../store/profile/selector";
import { selectAuthToken } from "../../store/authToken/selector";
import { selectAuthUserAzureAD } from "../../store/auth/selector";

export function HomePage() {
  const userProfile = useSelector(selectProfile);
  const activeRole = useSelector(selectProfileActiveRole);
  const authToken = useSelector(selectAuthToken);
  const userAzureAD = useSelector(selectAuthUserAzureAD);

  // console.log(userProfile);
  // console.log(userAzureAD);
  // console.log(activeRole);
  // console.log(userAzureAD);
  // console.log(authToken);
  return <PageWrapper>Alumni Dashboard</PageWrapper>;
}
