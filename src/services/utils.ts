import axios from "axios";

const URL : string = import.meta.env.VITE_API_URL;

export const getProducts : () => Promise<any> = async () => {
  try {
    const response = await axios.get(`${URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
export const createProduct : (product: any) => Promise<any> = async (product) => {
  try {
    const response = await axios.post(`${URL}/products`, product);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export const updateProduct : (id: string, product: any) => Promise<any> = async (id, product) => {
  try {
    const response = await axios.put(`${URL}/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export const deleteProduct : (id: string) => Promise<any> = async (id) => {
  try {
    const response = await axios.delete(`${URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export const createSell : (sell: any) => Promise<any> = async (sell) => {
  try {
    const response = await axios.post(`${URL}/sells`, sell);
    return response.data;
  } catch (error) {
    console.error("Error creating sell:", error);
    throw error;
  }
}

export const getSellsByDate : (date: string) => Promise<any> = async (date) => {
  try {
    const response = await axios.get(`${URL}/sells/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sells by date:", error);
    throw error;
  }
}