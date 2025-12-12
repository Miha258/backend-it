// src/database/seed.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../services/service.entity';
import { Master } from '../masters/master.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../users/role.enum';
import { ServiceCategory } from '../services/service-category.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Master)
    private readonly masterRepo: Repository<Master>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ServiceCategory)
    private readonly categoryRepo: Repository<ServiceCategory>,
  ) {}

  async onModuleInit() {
    await this.run();
  }

  async run() {
    const passwordHash = 'dummy_hash';
    const categoriesCount = await this.categoryRepo.count();
    if (categoriesCount === 0) {
      const categoriesConfig = [
        { name: 'Волосся' },
        { name: 'Нігті' },
        { name: 'Макіяж' },
        { name: 'Брови' },
      ];

      const categoryEntities = this.categoryRepo.create(categoriesConfig);
      await this.categoryRepo.save(categoryEntities);
    }

    // 2. Юзери-майстри – ІДЕМПOTENT (шукаємо по email, якщо нема — створюємо)
    const masterUserEmails = [
      'master1@test.ua',
      'master2@test.ua',
      'master3@test.ua',
    ];

    const masterUsers: User[] = [];

    for (const email of masterUserEmails) {
      let user = await this.userRepo.findOne({ where: { email } });

      if (!user) {
        user = this.userRepo.create({
          email,
          passwordHash,
          role: UserRole.MASTER,
        });
        user = await this.userRepo.save(user);
      }

      masterUsers.push(user);
    }

    const services = await this.serviceRepo.find();
    const servicesBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

    const mastersConfig: Array<{
      fullName: string;
      role: string;
      rating: number;
      photoUrl: string;
      description: string;
      experienceYears: number;
      phone: string;
      email: string;
      user: User;
      serviceSlugs: string[];
    }> = [
      {
        fullName: 'Олена Петрівна',
        role: 'Топ-стиліст',
        rating: 5.0,
        photoUrl: 'https://kafo.kiev.ua/uploads/p_139_61321742.jpg',
        description:
          'Спеціалізується на складних фарбуваннях (AirTouch, Balayage) та стрижках. Досвід 10 років.',
        experienceYears: 10,
        phone: '+380501234567',
        email: 'olena.petrivna@salon.ua',
        user: masterUsers[0],
        serviceSlugs: [
          'zhinocha-strizhka',
          'farbuvannya-airtouch',
          'pedikyur-spa',
        ],
      },
      {
        fullName: 'Марина Іванова',
        role: 'Nail-майстер',
        rating: 4.9,
        photoUrl: 'https://kafo.kiev.ua/uploads/p_140_35639904.jpg',
        description:
          'Творчий підхід до дизайну нігтів, працює лише з преміум-матеріалами. Швидкість та якість.',
        experienceYears: 7,
        phone: '+380502345678',
        email: 'marina.ivanova@salon.ua',
        user: masterUsers[1],
        serviceSlugs: ['manikyur-gel', 'pedikyur-spa'],
      },
      {
        fullName: 'Аліна Кравець',
        role: 'Візажист',
        rating: 4.8,
        photoUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT4dmjRBIUpC6TnSSjgKrsaC9j-8X7J6du2g&s',
        description:
          'Створюю образи для червоної доріжки. Професійний макіяж для будь-яких подій.',
        experienceYears: 5,
        phone: '+380503456789',
        email: 'alina.kravets@salon.ua',
        user: masterUsers[2],
        serviceSlugs: ['makiyazh-vechirniy', 'laminuvannya-briv'],
      },
    ];

    for (const m of mastersConfig) {
      let master = await this.masterRepo.findOne({
        where: { email: m.email },
        relations: ['services'],
      });

      if (!master) {
        master = this.masterRepo.create({
          fullName: m.fullName,
          role: m.role,
          rating: m.rating,
          photoUrl: m.photoUrl,
          description: m.description,
          experienceYears: m.experienceYears,
          phone: m.phone,
          email: m.email,
        });
      } else {
        master.fullName = m.fullName;
        master.role = m.role;
        master.rating = m.rating;
        master.photoUrl = m.photoUrl;
        master.description = m.description;
        master.experienceYears = m.experienceYears;
        master.phone = m.phone;
        master.email = m.email;
      }
      master.services = m.serviceSlugs
        .map((slug) => servicesBySlug[slug])
        .filter(Boolean);

      await this.masterRepo.save(master);
    }
  }
}
