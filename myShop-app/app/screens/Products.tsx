import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { fetchProducts } from '@/api/api';
import { ProductsPageProps } from '@/navigation/ProductsStack';

const Products = ({ navigation }: ProductsPageProps) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    load();
  }, []);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => navigation.navigate('ProductDetails', { id: item.id })}>
      <Image style={styles.productImage} source={{ uri: item.product_image }} />
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productPrice}>${item.product_price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={products} renderItem={renderProductItem} keyExtractor={(item) => item.id.toString()} numColumns={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  productItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default Products;
