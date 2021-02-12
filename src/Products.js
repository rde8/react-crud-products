import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { productsData } from './data';

function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }


const useStyles = makeStyles((theme) => ({
    boxStyle: {
        margin  : '20px 0 20px 0'
    },
    btnStyle: {
        float: 'right',
        lineHeight: '50px'
    },
    delBtnStyle: {
        float: 'right',
        lineHeight: '50px',
        marginRight: '10px'
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    inputStyle: {
        marginRight: '20px'
    },
    modalBtnStyle: {
        marginTop: '13px',
        display: 'inline-block'
    }
}));

const columns = [
    { field: 'id', headerName: 'count', width: 90},
    { field: 'product_name', headerName: 'Product Name', width: 145},
    { field: 'product_description', headerName: 'Product Description', width: 190},
    { field: 'is_active', headerName: 'Status', width: 100},
    {
        field: 'price',
        headerName: 'price',
        type: 'number',
        width: 90,
    },
    {
        field: 'offer_price',
        headerName: 'offer price',
        type: 'number',
        width: 120,
    },
    {
        field: 'offer_start_at',
        headerName: 'offer start at',
        width: 190,
    },
    {
        field: 'offer_end_at',
        headerName: 'offer end at',
        width: 190,
    },
    {
        field: 'created_at',
        headerName: 'created at',
        width: 190,
    },
    {
        field: 'updated_at',
        headerName: 'updated at',
        width: 190,
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        renderCell: (params) => (
            <strong>
              <Button
                variant="contained"
                color="primary"
                size="small"
              >
                Edit
              </Button>
            </strong>
          ),
    }
  ];

  let formElements = [
    {
        label: "Product Name",
        key: 'product_name'
    },
    {
        label: "Product Description",
        key: 'product_description'
    },
    {
        label: "Status",
        key: 'is_active'
    },
    {
        label: "Price",
        key: 'price'
    },
    {
        label: "Offer Price",
        key: 'offer_price'
    },
    {
        label: "Offer Start At",
        key: 'offer_start_at'
    },
    {
        label: "Offer End At",
        key: 'offer_end_at'
    }
  ];

  const initialProductObj = {
    id : null,
    product_name: "",
    product_description: "",
    is_active: false,
    price: "",
    offer_price: "",
    offer_start_at: "",
    offer_end_at: "",
    created_at: "",
    updated_at: "",
    actios: ""
};

const Product = () => {
    const classes = useStyles();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState(initialProductObj);
    const [delList, setDeldata] = useState([]);
    const fetchProducts = () => {
        setProducts(productsData);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (value, key) => {
        setFormData({...formData, ...{[key] : value}});
    };

    const onSelectedRows = (obj) => {
        if(obj.rowIds){
            setDeldata(obj.rowIds);
        }
    }

    const delData = () => {
        const modifiedArr = products.filter((obj) => {
            return delList.indexOf(obj.id) === -1;
        });
        setProducts(modifiedArr);
        setDeldata([]);
    }

    const submit = () => {
        if(formData.id === null) {
            const modifiedObj = {...formData, ...{
                id: products.length + 1,
                created_at: (new Date).toString(),
                updated_at: (new Date).toString(),
                "actions": "edit"
            }};
            setProducts([...products, ...[modifiedObj]]);
        }else {
            const modifiedList = products.map((obj) => {
                if(obj.id === formData.id){
                    return formData;
                }
                return obj;
            })
            setProducts([...modifiedList]);
        }
        setFormData(initialProductObj);
        handleClose();
    };

    const editProduct = (row) => {
        setFormData(row);
        handleOpen();
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <form>
                {formElements.map(formElement => {
                    return <div key={formElement.key}>
                        {formElement.label}
                        {formElement.key !== 'is_active' ? (
                            <input value={formData[formElement.key]}
                            type="text"
                            onChange={(e) => handleChange(e.target.value, formElement.key)} />
                        ) : (
                            <input checked={formData[formElement.key]}
                            type="checkbox"
                            onChange={(e) => handleChange(e.target.value, formElement.key)} />
                        )}
                        
                    </div>
                })}
                <button onClick={(e) => { e.preventDefault(); submit();}}>
                    {formData.id === null ? 'Create product' : 'Edit Product'}
                </button>
            </form>
        </div>
    );
    return (
        <React.Fragment>
            <Box className={classes.boxStyle}>
            <Typography variant="h3">
                Products Management
                <Button variant="contained" color="primary" className={classes.btnStyle} onClick={handleOpen}>
                    Create Product
                </Button>
                {
                delList.length > 0 && (
                        <Button variant="contained" color="primary" className={classes.delBtnStyle} onClick={delData}>Delete</Button>
                    )
                }
            </Typography>
            </Box>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid 
                    onCellClick={(e) => editProduct(e.row)}
                    // onRowSelected={(e) => onSelectedRows(e)}
                    onSelectionChange={(e) => onSelectedRows(e)}
                    rows={products} 
                    columns={columns} 
                    pageSize={5} 
                    checkboxSelection />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </React.Fragment>
    );
}

export default Product;