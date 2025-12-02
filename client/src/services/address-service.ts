import { api } from "@/lib/axios";

export interface IAddress {
  id?: number;
  street: string;
  complement?: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}

const findAllByAuthenticatedUser = () => {
  return api.get<IAddress[]>("/addresses");
};

const findById = (id: number) => {
  return api.get<IAddress>(`/addresses/${id}`);
};

const create = (address: IAddress) => {
  return api.post<IAddress>("/addresses", address);
};

const remove = (id: number) => {
  return api.delete(`/addresses/${id}`);
};

const AddressService = {
  findAllByAuthenticatedUser,
  findById,
  create,
  remove,
};

export default AddressService;
