import { useState } from 'react';
import { Button } from '../components/Button';

import { Cart } from '../components/Cart';
import {CartItem} from '../types/CartItem';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';

import { Container, CategoriesContainer,MenuContainer,Footer, FooterContainer } from './styles';
import { Product } from '../types/Product';

export function Main() {
  const [isTablableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
  ]);

  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }

  function handleCancelOrder() {
    setSelectedTable('');
  }

  function handleAddToCart(product: Product) {
    if (!selectedTable) {
      setIsTableModalVisible(true);
    }
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(cartItem => cartItem.product._id === product._id);

      if (itemIndex < 0) {
        return prevState.concat({
          quantity:1,
          product,
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];
      newCartItems[itemIndex] ={
        ...item,
        quantity: item.quantity +1,
      };
      return newCartItems;
    });
  }

  function handleDecrementCartItem(product: Product) {
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(cartItem => cartItem.product._id === product._id);

      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if (item.quantity === 1) {
        newCartItems.splice(itemIndex, 1);

        return newCartItems;
      }

      newCartItems[itemIndex] ={
        ...item,
        quantity: item.quantity -1,
      };
      return newCartItems;


    });
  }

  return (
    <>
      <Container>


        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleCancelOrder}
        />

        <CategoriesContainer>
          <Categories />
        </CategoriesContainer>
        <Menu onAddToCart={handleAddToCart}/>

        <MenuContainer>
          <MenuContainer/>
        </MenuContainer>
      </Container>
      <Footer>
        <FooterContainer>
          {!selectedTable && (
            <Button onPress={() => setIsTableModalVisible(true)} >
            Novo Pedido
            </Button>
          )}
          {selectedTable && (
            <Cart
              cartItems ={cartItems}
              onAdd={handleAddToCart}
              onDecrement={handleDecrementCartItem}
            />
          )}
        </FooterContainer>
      </Footer>

      <TableModal
        visible={isTablableModalVisible}
        onClose={() => setIsTableModalVisible(false)}
        onSave={handleSaveTable}
      />
    </>
  );
}