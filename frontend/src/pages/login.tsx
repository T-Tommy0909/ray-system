import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FilledButton } from "components/common/button/FilledButton";
import { TextField } from "components/common/form/TextField";
import { ValidatableForm } from "components/common/form/ValidatableForm";
import { login, useMyUserData } from "utils/apis/auth";
import { stringNotEmpty } from "utils/hooks/useValidation";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userData, isValidating, refetch } = useMyUserData();

  useEffect(() => {
    if (!isValidating) {
      if (userData) {
        router.replace("/");
      }
    }
  }, [userData, isValidating, router]);

  const onClickLogin = async () => {
    const userData = {
      email,
      password,
    };

    const isAuthenticated = await login(userData);
    if (isAuthenticated === true) {
      refetch();
      await router.replace("/");
    }
  };

  return (
    <Container>
      <Title>ログイン</Title>
      <ValidatableForm onValidated={setIsValid} onSubmit={onClickLogin}>
        <InputArea>
          <Label>Email</Label>
          <TextField
            value={email}
            type={"email"}
            autoComplete={"email"}
            onChange={setEmail}
            rules={[stringNotEmpty()]}
            placeholder="email"
          />
        </InputArea>
        <InputArea>
          <Label>Password</Label>
          <TextField
            type={"password"}
            value={password}
            autoComplete={"current-password"}
            onChange={setPassword}
            rules={[stringNotEmpty()]}
            placeholder="password"
          />
        </InputArea>
        <BottomWrap>
          <FilledButton type="submit" disabled={!isValid}>
            login
          </FilledButton>
        </BottomWrap>
      </ValidatableForm>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  gap: 1.5rem;
  width: 100%;
  height: fit-content;
  max-width: 25rem;
  min-width: 20rem;
  max-height: 30rem;
  padding: 2.5rem;
  margin: auto;
  border: 0.25rem solid ${(p) => p.theme.colors.primary[700]};
  border-radius: 1rem;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.5rem;
`;

const InputArea = styled.div`
  height: 5.4rem;
`;

const Label = styled.p`
  font-size: 0.75rem;
`;

const BottomWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  height: 2.5rem;
  margin-bottom: 1rem;
`;
