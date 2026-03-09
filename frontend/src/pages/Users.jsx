import React from 'react'
import { useState, useEffect } from 'react';

const Users = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/users`)
            .then(response => {
               
                if (!response.ok) {
                    throw new Error(`Lỗi từ Backend: ${response.status}`);
                }
                return response.json(); 
            })
            .then(data => {
               
                
                setUsers(data);
                
                setLoading(false);
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error); 
                setLoading(false);
            });
    }, []);
    
    if (loading) return <p>Đang tải dữ liệu...</p>;


    return (
       <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Danh sách Người Dùng</h2>
            
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '50%', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>ID</th>
                        <th>Họ và Tên</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Users