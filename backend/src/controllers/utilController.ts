import { Request, Response } from "express";
import axios from "axios";

export const getCurrrencies = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.CURRENCY_API_KEY}&currencies=EUR%2CUSD%2CILS`
    );

    res.status(200).json({ ...data });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
