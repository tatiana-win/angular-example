import {Expose, Transform} from 'class-transformer';

function convertToStringArray(value) {
  return !!value ? value.map(String) : [];
}

export class Customer {

  @Expose({name: 'blocking_date'})
  blockingDate: string;

  @Expose({name: 'blocking_reasons'})
  @Transform(convertToStringArray)
  blockingReasons: string[];

  @Expose({name: 'customer_id'})
  id: string;

  @Expose({name: 'first_name'})
  firstName: string;

  @Expose({name: 'last_name'})
  lastName: string;

  @Expose({name: 'first_ride_region'})
  firstRideRegion: string;

  @Expose({name: 'number_trip'})
  tripsCount: number;

  phone: string;

  email: string;

  photo: string;

  rating: number;

  @Expose({name: 'registration_timestamp'})
  registrationDate: string;
}
