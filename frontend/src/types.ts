export interface Server extends ServerType {
  id: number;
  name: string;
  is_running: boolean;
  ip: string;
  start_time: Date;
  total_running_time: number;
}

export interface ServerType {
  type_id: number;
  type_name: string;
  price_per_minute: number;
}

export interface Currency {
  name: string;
  rate: number;
}
