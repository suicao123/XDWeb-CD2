import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const getErrorMessage = (data, fallbackMessage) => {
    if (!data) {
        return fallbackMessage;
    }

    if (typeof data.message === 'string' && data.message.trim()) {
        return data.message;
    }

    if (data.errors && typeof data.errors === 'object') {
        const firstError = Object.values(data.errors).flat()[0];

        if (firstError) {
            return firstError;
        }
    }

    return fallbackMessage;
};

const Register = () => {
    const navigate = useNavigate();
    
    // Quản lý state cho form (đã xóa otp)
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirm_password: ''
    });

    const BASE_URL = import.meta.env.VITE_API_BASE_URL_API;

    // Hàm xử lý khi người dùng nhập liệu
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Xử lý Đăng Ký
    const handleRegister = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.fullname,
            username: formData.username || undefined,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirm_password,
        };

        if (payload.password !== payload.password_confirmation) {
            alert('Password confirmation does not match.');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const contentType = res.headers.get('content-type') || '';
            const data = contentType.includes('application/json') ? await res.json() : null;

            if (!res.ok) {
                alert(getErrorMessage(data, 'Register failed.'));
                return;
            }

            alert('Register successful.');
            navigate('/login');
        } catch (err) {
            alert('Cannot connect to server.');
            console.error(err);
        }

        return;

        // Kiểm tra mật khẩu khớp nhau (client-side check)
        if (formData.password !== formData.confirm_password) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Đăng ký thất bại");
            } else {
                alert("Đăng ký thành công 🎉");
                navigate('/login'); // Chuyển hướng sang trang Login
            }
        } catch (err) {
            alert("Lỗi kết nối server");
            console.error(err);
        }
    };

    return (
        <div className="register-page">
            <Navbar />
            
            <div className="container d-flex justify-content-center align-items-center"
                style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
                <div className="row overflow-hidden shadow-lg border-0 bg-white"
                    style={{ borderRadius: '30px', maxWidth: '1000px', width: '100%' }}>
                    
                    {/* Form Side */}
                    <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Create An Account</h2>
                            <p className="text-muted small">How do I get started in it'sYum</p>
                        </div>

                        <form onSubmit={handleRegister}>
                            {/* Full Name */}
                            <div className="mb-3 input-group bg-light rounded-pill px-3 py-1">
                                <span className="material-symbols-outlined pt-2 text-secondary">person</span>
                                <input type="text" className="form-control border-0 bg-transparent" 
                                    placeholder="Full name" id="fullname" required 
                                    onChange={handleChange} />
                            </div>

                            {/* Email */}
                            <div className="mb-3 input-group bg-light rounded-pill px-3 py-1">
                                <span className="material-symbols-outlined pt-2 text-secondary">email</span>
                                <input type="email" className="form-control border-0 bg-transparent" 
                                    placeholder="Email Address" id="email" required 
                                    onChange={handleChange} />
                            </div>

                            {/* Username */}
                            <div className="mb-3 input-group bg-light rounded-pill px-3 py-1">
                                <span className="material-symbols-outlined pt-2 text-secondary">badge</span>
                                <input type="text" className="form-control border-0 bg-transparent" 
                                    placeholder="Username (optional)" id="username"
                                    onChange={handleChange} />
                            </div>

                            {/* Password */}
                            <div className="mb-3 input-group bg-light rounded-pill px-3 py-1">
                                <span className="material-symbols-outlined pt-2 text-secondary">lock</span>
                                <input type="password" className="form-control border-0 bg-transparent" 
                                    placeholder="Password" id="password" required 
                                    onChange={handleChange} />
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-4 input-group bg-light rounded-pill px-3 py-1">
                                <span className="material-symbols-outlined pt-2 text-secondary">verified_user</span>
                                <input type="password" className="form-control border-0 bg-transparent" 
                                    placeholder="Confirm Password" id="confirm_password" required 
                                    onChange={handleChange} />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                                style={{ background: 'rgb(192, 68, 68)', border: 'none' }}>
                                Sign Up
                            </button>
                        </form>

                        <div className="d-flex align-items-center text-center mb-4 mt-4">
                            <hr className="flex-grow-1" /> <span className="px-2 small text-muted">Login with Others</span>
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
                            Đã có tài khoản? <Link to="/login" className="text-danger">Đăng nhập ngay</Link>
                        </p>
                    </div>

                    {/* Image Side */}
                    <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
                        style={{ background: 'linear-gradient(135deg, rgb(225, 167, 167), #ed5c5c)' }}>
                        <div className="image-container text-center">
                            <img src="/img/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security-people-entering-login-password-safety-measures_335657-3530.png"
                                className="img-fluid rounded-4 shadow" 
                                style={{ width: '70%', position: 'relative', zIndex: 2 }} 
                                alt="Register Illustration" />
                            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
