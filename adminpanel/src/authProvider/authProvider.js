export const authProvider = {
    login: ({ username, password }) => {
        const request = new Request('http://localhost:5000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {


                console.log(auth.role)
                localStorage.setItem('token', auth.userToken);
                window.location.reload();
                console.log(localStorage.getItem('token'), "login")

            })
            .catch(() => {
                throw new Error('Network error')
            });
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        const token = localStorage.getItem('token')
        console.log(localStorage.getItem('token'), "check")
        console.log({ token })
        return token
            ? Promise.resolve()
            : Promise.reject({ message: 'login.required' })
    },

    getPermissions: () => {
        const role = localStorage.getItem('role');
        if (role === "admin") {
            return Promise.resolve('admin');
        } else {
            return Promise.reject();
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        return Promise.resolve('/login');
    },
};

export default authProvider;