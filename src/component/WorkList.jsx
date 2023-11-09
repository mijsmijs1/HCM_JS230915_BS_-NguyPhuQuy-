import React, { useState, useEffect,useRef } from 'react';
import './WorkList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function WorkList() {
    const [workName, setWorkName] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editedWork, setEditedWork] = useState({
        name: '',
        index: 0,
    });
    const [workStatus, setWorkStatus] = useState(0);
    const workList = JSON.parse(localStorage.getItem('workName'));
    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    }, [workName]);
    useEffect(() => {
        setWorkName(JSON.parse(localStorage.getItem('workName') ?? '[]'));
    }, []);

    if (workList === null) {
        localStorage.setItem('workName', JSON.stringify(workName));
    }

    const handleEditForm = (item, index) => {
        setEditedWork({
            name: item.name,
            index: index,
        });
        setShowEditForm(true);
    };
    useEffect(
        () => {
            updateWorkStatus();
            console.log(workStatus)
        }
        , [workName])

    const updateWorkStatus = () => {
        const completedCount = workName.filter((item) => item.status === true).length;
        setWorkStatus(completedCount);
    };

    return (
        <div className='app_body'>
            <div className='container'>
                <h2>Danh sách công việc</h2>
                <form
                    className='form'
                    onSubmit={(e) => {
                        e.preventDefault();

                        const inputWorkValue = e.target.inputWork.value;
                        if (inputWorkValue !== '') {
                            setWorkName((prevWorkName) => {
                                const updatedWorkName = [
                                    ...prevWorkName,
                                    { name: inputWorkValue, status: false },
                                ];
                                localStorage.setItem('workName', JSON.stringify(updatedWorkName));
                                return updatedWorkName;
                            });
                            e.target.inputWork.value = '';
                        } else {
                            alert('Tên công việc không được để trống');
                        }
                    }}
                >
                    <input type='text' placeholder='Nhập tên công việc' name='inputWork' ref={inputRef}/>
                    <button type='submit'>Thêm</button>
                </form>
                <ul className='work_list'>
                    {workName.map((item, index) => (
                        <li className='work_item' key={index}>
                            <input
                                type='checkbox'
                                checked={item.status}
                                onChange={(e) => {
                                    const checkbox = e.target;
                                    const updatedWorkName = [...workName];
                                    updatedWorkName[index].status = checkbox.checked;
                                    setWorkName(updatedWorkName);
                                    localStorage.setItem('workName', JSON.stringify(updatedWorkName));
                                }}
                            />
                            <span
                                className='item_name'
                                id={item.name}
                                style={item.status ? { textDecoration: 'line-through' } : null}
                            >
                                {item.name}
                            </span>
                            <FontAwesomeIcon className='icon' icon={faPen} onClick={() => handleEditForm(item, index)} />
                            <FontAwesomeIcon
                                className='icon_delete'
                                icon={faTrash}
                                onClick={() => {
                                    if (window.confirm(`Bạn có thực sự muốn xóa < ${item.name} > không`)) {
                                        const newWork = JSON.parse(localStorage.getItem('workName')) || [];
                                        const result = newWork.filter((filterItem) => filterItem.name !== item.name);
                                        setWorkName(result);
                                        localStorage.setItem('workName', JSON.stringify(result));
                                    }
                                }}
                            />
                        </li>
                    ))}
                </ul>

                <div className='work_status'>Công việc đã hoàn thành: {workStatus}/{workName.length}</div>
            </div>

            {showEditForm && (
                <div className='edit_form_container'>
                    <h2>Cập nhật công việc</h2>
                    <form
                        className='edit-form'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const inputWorkValue = e.target.editWork.value;
                            if (inputWorkValue !== '') {
                                const updatedWorkName = workName.map((item, index) => {
                                    if (index === editedWork.index) {
                                        return { name: inputWorkValue, status: item.status };
                                    }
                                    return item;
                                });
                                setWorkName(updatedWorkName);
                                localStorage.setItem('workName', JSON.stringify(updatedWorkName));
                            } else {
                                alert('Tên công việc không được để trống');
                            }
                            setShowEditForm(false);
                        }}
                    >
                        <label>Tên công việc</label>
                        <input type='text' defaultValue={editedWork.name} name='editWork' />
                        <button onClick={() => setShowEditForm(false)}>Hủy</button>
                        <button type='submit'>Đồng ý</button>
                    </form>
                </div>

            )}
        </div>
    );
}