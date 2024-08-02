import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AccountTextField from "./AccountTextField";
import { AccountFormFooter } from "./AccountFormFooter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.email) {
      errors.email = "メールアドレスが必要です";
    }
    if (!data.password) {
      errors.password = "パスワードが必要です";
    }
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formState);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { email, password } = formState;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    navigate("/login", { state: { referrer: "signUp" } });
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        width: "100%",
      }}
      onSubmit={onSubmit}
    >
      <AccountTextField
        id="email"
        name="email"
        value={formState.email}
        onChange={handleChange}
        error={errors.email}
        type="text"
        label="メールアドレス"
        secondaryLabel="メールアドレスを入力..."
        icon={<PersonOutlineOutlinedIcon />}
        disabled={isSubmitting}
      />
      <AccountTextField
        id="password"
        name="password"
        value={formState.password}
        onChange={handleChange}
        type="password"
        error={errors.password}
        label="パスワード"
        secondaryLabel="パスワードを入力..."
        icon={<LockOutlinedIcon />}
        disabled={isSubmitting}
      />
      <AccountFormFooter
        disabled={isSubmitting}
        text="サインアップ"
        icon={<ArrowForwardIcon />}
        secondaryText="アカウントを持っている場合"
        onClick={handleClick}
      />
    </form>
  );
};
