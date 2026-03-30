import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';

// Hàm helper xử lý thông báo lỗi từ API (Đã gộp và tối ưu)
const getErrorMessage = (data, fallbackMessage) => {
    if (!data) return fallbackMessage;

    if (typeof data.message === 'string' && data.message.trim()) {
        return data.message;
    }

    if (data.errors && typeof data.errors === 'object') {
        const firstError = Object.values(data.errors).flat()[0];
        if (firstError) return firstError;
    }

    return data.error || fallbackMessage;
};

const Login = () => {
    // Sử dụng username để khớp với biến trong input bên dưới
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Lấy cấu hình từ biến môi trường
        const loginApi = import.meta.env.VITE_API_LOGIN || '/login';
        const baseUrl = import.meta.env.VITE_API_BASE_URL_API || '';
        const loginUrl = `${baseUrl}${loginApi}`;

        try {
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Gửi data: khớp với state username và password
                body: JSON.stringify({ login: username, password }), 
            });

            const contentType = res.headers.get('content-type') || '';
            const data = contentType.includes('application/json') ? await res.json() : null;

            if (!res.ok) {
                alert(getErrorMessage(data, 'Đăng nhập thất bại. Vui lòng kiểm tra lại.'));
                setIsLoading(false);
                return;
            }

            // Lưu Token vào LocalStorage
            const accessToken = data.access_token || data.access;
            if (accessToken) {
                localStorage.setItem('access', accessToken);
                localStorage.setItem('access_token', accessToken);
            }
            
            localStorage.setItem('token_type', data.token_type || 'Bearer');

            // Lưu thông tin User
            const userData = data.user || (data.username ? { name: data.username } : null);
            if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
            }

            // Xử lý chuyển hướng
            const redirectUrl = localStorage.getItem('redirect_after_login') || '/';
            localStorage.removeItem('redirect_after_login');

            alert('Đăng nhập thành công!');
            
            // Reload trang để cập nhật Navbar và chuyển hướng
            window.location.href = redirectUrl;

        } catch (err) {
            alert('Không thể kết nối đến server.');
            console.error("Login Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="d-flex align-items-center justify-content-center w-100"
                style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8 col-xl-9">
                            <div className="row overflow-hidden shadow-lg border-0 bg-white" style={{ borderRadius: '30px' }}>

                                {/* Cột Form */}
                                <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold">LOGIN</h2>
                                        <p className="text-muted small">How do I get started in it'sYum</p>
                                    </div>

                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3 input-group bg-light rounded-pill px-3 py-1">
                                            <span className="material-symbols-outlined align-middle pt-2 text-secondary">person</span>
                                            <input
                                                type="text"
                                                className="form-control border-0 bg-transparent"
                                                placeholder="Email or username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 input-group bg-light rounded-pill px-3 py-1">
                                            <span className="material-symbols-outlined align-middle pt-2 text-secondary">lock</span>
                                            <input
                                                type="password"
                                                className="form-control border-0 bg-transparent"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100 rounded-pill py-2 fw-bold mb-4"
                                            disabled={isLoading}
                                            style={{ background: 'rgb(192, 68, 68)', border: 'none' }}
                                        >
                                            {isLoading ? 'Connecting...' : 'Login Now'}
                                        </button>
                                    </form>

                                    <div className="d-flex align-items-center text-center mb-4">
                                        <hr className="flex-grow-1" /> 
                                        <span className="px-2 small text-muted">Login with Others</span>
                                        <hr className="flex-grow-1" />
                                    </div>

                                    <button className="btn btn-outline-light text-dark border rounded-pill w-100 mb-2 d-flex align-items-center justify-content-center gap-2">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="18" alt="Google" />
                                        Login with Google
                                    </button>
                                    <button className="btn btn-outline-light text-dark border rounded-pill w-100 d-flex align-items-center justify-content-center gap-2">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png" width="18" alt="Facebook" />
                                        Login with Facebook
                                    </button>

                                    <p className="fw-bold small pt-3 text-center">
                                        Chưa có tài khoản? <Link to="/register" className="text-danger">Đăng ký ngay</Link>
                                    </p>
                                </div>

                                {/* Cột Hình ảnh */}
                                <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
                                    style={{ background: 'linear-gradient(135deg, rgb(225, 167, 167), #ed5c5c)' }}>
                                    <div className="text-center w-100">
                                        <div style={{ position: 'relative', display: 'inline-block', width: '70%' }}>
                                            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                                            <img 
                                                src="/img/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.png"
                                                className="img-fluid rounded-4 shadow"
                                                style={{ position: 'relative', zIndex: 2, width: '100%' }}
                                                alt="Login Illustration" 
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/400x400?text=Login+Image"; }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;