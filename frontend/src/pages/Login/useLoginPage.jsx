import { useEffect, useState } from 'react';
import { useAuth } from '../../context/Auth/useAuth';
import { useNavigate } from 'react-router';
import useToastStore from '../../store/useToastStore';

export const useLoginPage = () => {
  const [ formLogin, setFormLogin ] = useState({email: '', password: '', rememberMe: false});
  const [ errorsLogin, setErrorsLogin ] = useState({email: '', password: ''});
  const { login, isLoading, error, userSession } = useAuth();
  const showToast = useToastStore((state) => state.showToast);
  const { isLoggedIn } = userSession;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  useEffect(()=>{
    if(error){
      showToast(error, 'danger');
    }
  },[error, showToast]);

  const handleInputChange = (e) => {
    if(e.target.value.trim().length === 0){
      setErrorsLogin({...errorsLogin, [e.target.name]: 'Este campo es requerido'});
    }else{
      setErrorsLogin({...errorsLogin, [e.target.name]: ''});
    }
    setFormLogin({...formLogin, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        login(formLogin)
    }catch(error){
      showToast(error.message, 'danger');
    }
  };

  const handleRememberMeClick = () => {
    setFormLogin({...formLogin, rememberMe: !formLogin.rememberMe});
  }
  

  return {
      formLogin,
      errorsLogin,
      isLoading,
      error,
      userSession,
      handleInputChange,
      handleSubmit,
      handleRememberMeClick
  }
}