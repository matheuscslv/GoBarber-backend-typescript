import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '2939897'
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('2939897')
  })

  it('should not be able to create a new appointments on the same time', async () => {
    const appointmentDate = new Date(2020,4,10,11)

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '2939897'
    })

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '2939897'
      })
    ).rejects.toBeInstanceOf(AppError)

  })
})
