import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Add, 
  Remove, 
  Delete, 
  CreditCard,
  LocalShipping 
} from '@mui/icons-material';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const primaryColor = "#173334";
  
  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    paymentType: 'cash',
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  });

  // API Configuration
  const API_BASE_URL = window.location.origin.includes("localhost") 
    ? "http://localhost:5000/api" 
    : "https://back-4-sjcm.onrender.com/api";
  
  const getAuthToken = () => {
    return localStorage.getItem('token') || 'your-auth-token-here';
  };

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cart/getcart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setCart(data.data);
        setError('');
      } else {
        setError(data.msg || 'Failed to fetch cart');
        setCart(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update product quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/addcart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId,
          quantity: newQuantity
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setCart(data.data);
      } else {
        setError(data.msg || 'Failed to update quantity');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Update quantity error:', err);
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/deletcart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        fetchCart();
      } else {
        setError(data.msg || 'Failed to remove item');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Remove from cart error:', err);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!checkoutForm.firstName || !checkoutForm.address || !checkoutForm.city || !checkoutForm.state || !checkoutForm.zip) {
      setError('Please fill in all required fields');
      return;
    }

    setCheckoutLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutForm)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Order placed successfully! Order ID: ${data.data.orderId}`);
        setShowCheckout(false);
        fetchCart();
      } else {
        setError(data.msg || 'Checkout failed');
      }
    } catch (err) {
      setError('Network error during checkout. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: '#f8f9fa',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: primaryColor, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666' }}>
            Loading your cart...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <ShoppingCart sx={{ fontSize: 40, color: primaryColor, mr: 2 }} />
            <Typography 
              variant="h3" 
              sx={{ 
                color: primaryColor, 
                fontWeight: 700,
                position: 'relative'
              }}
            >
              Shopping Cart
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '100px',
                  height: '3px',
                  backgroundColor: primaryColor,
                  borderRadius: '2px',
                }}
              />
            </Typography>
          </Box>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty Cart */}
        {!cart || !cart.products || cart.products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ textAlign: 'center', py: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <ShoppingCart sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 2, color: '#666', fontWeight: 600 }}>
                  Your cart is empty
                </Typography>
                <Typography variant="body1" sx={{ color: '#999' }}>
                  Add some products to get started!
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card sx={{ boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3, 
                        color: primaryColor, 
                        fontWeight: 700,
                        borderBottom: '2px solid #f0f0f0',
                        pb: 2
                      }}
                    >
                      Cart Items ({cart.products.length})
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {cart.products.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card sx={{ 
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            border: '1px solid #f0f0f0',
                            '&:hover': {
                              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease'
                            }
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}>
                                  <img
                                    src={item.product.image || '/placeholder.png'}
                                    alt={item.product.title}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                      e.target.src = '/placeholder.png';
                                    }}
                                  />
                                </Box>
                                
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: primaryColor, 
                                      fontWeight: 600,
                                      mb: 1,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {item.product.title}
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ color: '#666', mb: 2 }}
                                  >
                                    {item.product.description}
                                  </Typography>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ color: '#2e7d32', fontWeight: 700 }}
                                  >
                                    ₹{item.product.price}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    border: '2px solid #f0f0f0',
                                    borderRadius: '25px',
                                    overflow: 'hidden'
                                  }}>
                                    <IconButton
                                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      sx={{ 
                                        color: primaryColor,
                                        '&:hover': { backgroundColor: '#f0f0f0' }
                                      }}
                                    >
                                      <Remove />
                                    </IconButton>
                                    
                                    <Typography 
                                      sx={{ 
                                        minWidth: '40px', 
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        fontSize: '1.1rem'
                                      }}
                                    >
                                      {item.quantity}
                                    </Typography>
                                    
                                    <IconButton
                                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                      sx={{ 
                                        color: primaryColor,
                                        '&:hover': { backgroundColor: '#f0f0f0' }
                                      }}
                                    >
                                      <Add />
                                    </IconButton>
                                  </Box>
                                  
                                  <Box sx={{ textAlign: 'right', minWidth: '80px' }}>
                                    <Typography 
                                      variant="h6" 
                                      sx={{ color: primaryColor, fontWeight: 700, mb: 1 }}
                                    >
                                      ₹{item.price}
                                    </Typography>
                                    <IconButton
                                      onClick={() => removeFromCart(item.product._id)}
                                      sx={{ 
                                        color: '#d32f2f',
                                        '&:hover': { backgroundColor: '#ffebee' }
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card sx={{ 
                  position: 'sticky',
                  top: 20,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                }}>
                  <CardContent>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3, 
                        color: primaryColor, 
                        fontWeight: 700,
                        textAlign: 'center'
                      }}
                    >
                      Order Summary
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ color: '#666' }}>Subtotal</Typography>
                        <Typography sx={{ fontWeight: 600 }}>₹{cart.totalAmount}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
                          <LocalShipping sx={{ mr: 1, fontSize: 18 }} />
                          Shipping
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#2e7d32' }}>Free</Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ color: '#2e7d32', fontWeight: 700 }}
                        >
                          ₹{cart.totalAmount}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => setShowCheckout(true)}
                      sx={{
                        backgroundColor: primaryColor,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: '10px',
                        boxShadow: '0 4px 15px rgba(23,51,52,0.3)',
                        '&:hover': {
                          backgroundColor: '#0f2425',
                          boxShadow: '0 6px 20px rgba(23,51,52,0.4)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      startIcon={<CreditCard />}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}

        {/* Checkout Dialog */}
        <Dialog 
          open={showCheckout} 
          onClose={() => setShowCheckout(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            color: primaryColor, 
            fontWeight: 700,
            fontSize: '1.8rem',
            pb: 1
          }}>
            Checkout
            <Box
              sx={{
                width: '60px',
                height: '3px',
                backgroundColor: primaryColor,
                borderRadius: '2px',
                mx: 'auto',
                mt: 1
              }}
            />
          </DialogTitle>
          
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="paymentType"
                    value={checkoutForm.paymentType}
                    onChange={handleInputChange}
                    label="Payment Method"
                  >
                    <MenuItem value="cash">Cash on Delivery</MenuItem>
                    <MenuItem value="card">Credit/Debit Card</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  name="firstName"
                  value={checkoutForm.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={checkoutForm.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address *"
                  name="address"
                  value={checkoutForm.address}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  name="address2"
                  value={checkoutForm.address2}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City *"
                  name="city"
                  value={checkoutForm.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State *"
                  name="state"
                  value={checkoutForm.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="ZIP Code *"
                  name="zip"
                  value={checkoutForm.zip}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  border: `2px solid ${primaryColor}20`
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                      Order Total
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ color: '#2e7d32', fontWeight: 700 }}
                    >
                      ₹{cart?.totalAmount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setShowCheckout(false)}
              variant="outlined"
              size="large"
              sx={{ 
                flex: 1,
                borderColor: '#ccc',
                color: '#666',
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              variant="contained"
              size="large"
              sx={{
                flex: 1,
                backgroundColor: primaryColor,
                '&:hover': {
                  backgroundColor: '#0f2425'
                }
              }}
            >
              {checkoutLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Place Order'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CartPage;