import { useLogin, useNotify, Login } from 'react-admin';

const LoginPage = () => {
    const login = useLogin();
    const notify = useNotify();
    const handleSubmit = e => {
        e.preventDefault();
        // will call authProvider.login({ email, password })
        // eslint-disable-next-line no-undef
        login({ username, password }).then((response) => {
            // Assuming the response includes a 'redirectTo' property
            if (response && response.redirectTo) {
                window.location.href = response.redirectTo;
            } else {
                // Default redirection if not specified
                window.location.href = '/books';
            }
        }).catch(() =>
            notify('Invalid email or password')
        );
    };
    return (
        <Login onSubmit={handleSubmit} />
    
     
    );
};

export default LoginPage;