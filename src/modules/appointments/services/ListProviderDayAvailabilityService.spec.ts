import AppError from '@shared/errors/AppError'

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('listProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository()
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentRepository)
  })

  it('should be able to list the day availabilty from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0)
    })

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 16, 0, 0)
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020,4,20,11).getTime();
    });

    const availability = listProviderDayAvailabilityService.execute({
      provider_id: 'user',
      day: 20,
      year: 2020,
      month: 5
    })

    expect(availability).toEqual(expect.arrayContaining([
      {hour: 8, available: false},
      {hour: 9, available: false},
      {hour: 10, available: false},
      {hour: 13, available: true},
      {hour: 14, available: false},
      {hour: 15, available: false},
      {hour: 16, available: true},
    ]))
  })
})