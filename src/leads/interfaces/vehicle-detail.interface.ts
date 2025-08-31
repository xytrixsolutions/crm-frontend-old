import { Lead } from '../entities/lead.entity';
import { VehicleDetail } from '../entities/vehicle-detail.entity';

export interface VehicleDetailInterface extends Lead {
  vehicleDetail?: VehicleDetail | null;
}
