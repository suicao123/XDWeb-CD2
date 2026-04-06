import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Hàm format giá tiền
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);


    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const BASE_URL_API = import.meta.env.VITE_API_BASE_URL_API;
    const CART_API = import.meta.env.VITE_API_CART;

    // Hàm xử lý link ảnh
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/80";
        if (imagePath.startsWith("http")) return imagePath;
        return `${BASE_URL}${imagePath}`;
    };

    // 1. Load dữ liệu giỏ hàng từ API
    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            alert("Vui lầm đăng nhập để xem giỏ hàng!");
            navigate('/login');
            return;
        }

        // Giả sử API lấy danh sách giỏ hàng là GET /api/cart/
        fetch(`${BASE_URL_API}${CART_API}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Lỗi tải giỏ hàng");
                return res.json();
            })
            .then(data => {
                setCartItems(data);
                calculateTotal(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);
        setTotal(totalAmount);
    };


    const handleCheckout = async () => {
        const token = localStorage.getItem("access");

        const orderData = {
            payment_method: 'momo', // Hoặc lấy từ state nếu có chọn lựa
            address: 'Địa chỉ người nhận' // Lấy từ input
        };

        try {
            const response = await fetch(`${BASE_URL_API}/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json"
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.payUrl) {
                // ĐÂY LÀ DÒNG QUAN TRỌNG: Chuyển hướng người dùng sang trang MoMo
                window.location.href = result.payUrl;
            } else {
                alert("Không nhận được link thanh toán từ MoMo");
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
        }
    };
    const handleRemoveItem = (itemId) => {
        const token = localStorage.getItem("access");
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        fetch(`${BASE_URL_API}/cart/${itemId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            }
        })
            .then(res => {
                if (res.ok) {
                    const newItems = cartItems.filter(item => item.id !== itemId);
                    setCartItems(newItems);
                    calculateTotal(newItems);
                } else {
                    alert("Lỗi khi xóa sản phẩm");
                }
            })
            .catch(err => console.error(err));
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;

        const token = localStorage.getItem("access");

        const oldItems = [...cartItems];

        const newItems = cartItems.map(item => {
            if (item.id === id) return { ...item, quantity: newQty };
            return item;
        });
        setCartItems(newItems);
        calculateTotal(newItems);

        fetch(`${BASE_URL_API}/cart/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ quantity: newQty })
        })
            .then(async res => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Lỗi cập nhật");
                }
            })
            .catch(err => {
                console.error("Lỗi API:", err);
                setCartItems(oldItems);
                calculateTotal(oldItems);
                alert("Không thể cập nhật số lượng: " + err.message);
            });
    };

    if (loading) return <div className="text-center mt-5 pt-5"><h3>Đang tải giỏ hàng...</h3></div>;

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ marginTop: '100px', paddingBottom: '50px' }}>
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                        <li className="breadcrumb-item text-dark fw-bold" aria-current="page">Giỏ hàng của bạn</li>
                    </ol>
                </nav>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <span className="material-symbols-outlined fs-1 text-muted">shopping_cart_off</span>
                        <h4 className="mt-3">Giỏ hàng đang trống</h4>
                        <Link to="/" className="btn btn-primary mt-3">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div className="row">
                        {/* Cột trái: Danh sách sản phẩm */}
                        <div className="col-lg-8">
                            <div className="card shadow-sm border-0 p-3 mb-3">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Giá</th>
                                                <th>Số lượng</th>
                                                <th>Tạm tính</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <img
                                                                src={getImageUrl(item.product.image)}
                                                                alt={item.product.productname}
                                                                className="cart-img rounded"
                                                                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                                                            />
                                                            <div>
                                                                <h6 className="mb-0 fw-bold">{item.product.productname}</h6>
                                                                <small className="text-muted">Màu: Mặc định</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="fw-semibold">{formatPrice(item.product.price)}đ</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            >-</button>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm text-center mx-1"
                                                                style={{ width: '50px' }}
                                                                value={item.quantity}
                                                                readOnly
                                                            />
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            >+</button>
                                                        </div>
                                                    </td>
                                                    <td className="fw-bold text-primary">
                                                        {formatPrice(item.product.price * item.quantity)}đ
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm text-danger"
                                                            onClick={() => handleRemoveItem(item.id)}
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Tổng tiền */}
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 p-4">
                                <h5 className="fw-bold mb-3">Tóm tắt đơn hàng</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span className="fw-bold">{formatPrice(total)}đ</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-success">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <strong className="fs-5">Tổng cộng:</strong>
                                    <strong className="fs-5 text-danger">{formatPrice(total)}đ</strong>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="btn btn-dark w-100 py-2 fw-bold text-white"
                                >
                                    THANH TOÁN NGAY (MOMO)
                                </button>
                                <Link to="/" className="btn btn-outline-secondary w-100 mt-2">
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Cart;