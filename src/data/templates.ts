import { FormTemplate } from '../types/form';

export const formTemplates: FormTemplate[] = [
  {
    id: 'az-car-rental-complete',
    name: 'AZ Car Rental - Formulário Completo',
    description: 'Formulário completo para coleta de informações de afiliados da AZ Car Rental',
    icon: 'Car',
    steps: [
      {
        title: 'Informações de Contato',
        description: 'Dados dos responsáveis pelos departamentos',
        fields: [
          {
            id: 'account_manager_email',
            type: 'email',
            label: 'Account Manager - Email',
            required: true
          },
          {
            id: 'account_manager_name',
            type: 'text',
            label: 'Account Manager - Nome',
            required: true
          },
          {
            id: 'customer_service_manager_email',
            type: 'email',
            label: 'Customer Service Manager - Email',
            required: true
          },
          {
            id: 'customer_service_manager_name',
            type: 'text',
            label: 'Customer Service Manager - Nome',
            required: true
          },
          {
            id: 'customer_service_email',
            type: 'email',
            label: 'Customer Service - Email',
            required: true
          },
          {
            id: 'customer_service_name',
            type: 'text',
            label: 'Customer Service - Nome',
            required: true
          },
          {
            id: 'reservations_pre_ft_lauderdale_email',
            type: 'email',
            label: 'Reservations Pre - Ft. Lauderdale - Email',
            required: false
          },
          {
            id: 'reservations_pre_ft_lauderdale_name',
            type: 'text',
            label: 'Reservations Pre - Ft. Lauderdale - Nome',
            required: false
          },
          {
            id: 'reservations_pre_miami_email',
            type: 'email',
            label: 'Reservations Pre - Miami - Email',
            required: false
          },
          {
            id: 'reservations_pre_miami_name',
            type: 'text',
            label: 'Reservations Pre - Miami - Nome',
            required: false
          },
          {
            id: 'reservations_pre_orlando_email',
            type: 'email',
            label: 'Reservations Pre - Orlando - Email',
            required: false
          },
          {
            id: 'reservations_pre_orlando_name',
            type: 'text',
            label: 'Reservations Pre - Orlando - Nome',
            required: false
          },
          {
            id: 'reservations_pre_tampa_email',
            type: 'email',
            label: 'Reservations Pre - Tampa - Email',
            required: false
          },
          {
            id: 'reservations_pre_tampa_name',
            type: 'text',
            label: 'Reservations Pre - Tampa - Nome',
            required: false
          },
          {
            id: 'reservations_post_email',
            type: 'email',
            label: 'Reservations Post - Email',
            required: false
          },
          {
            id: 'reservations_post_name',
            type: 'text',
            label: 'Reservations Post - Nome',
            required: false
          },
          {
            id: 'finance_email',
            type: 'email',
            label: 'Finance - Email',
            required: false
          },
          {
            id: 'finance_name',
            type: 'text',
            label: 'Finance - Nome',
            required: false
          }
        ]
      },
      {
        title: 'Informações da Localização',
        description: 'Detalhes sobre a localização e serviços',
        fields: [
          {
            id: 'web_service_code',
            type: 'text',
            label: 'Web Service Code',
            required: true
          },
          {
            id: 'type_of_store',
            type: 'select',
            label: 'Type of Store',
            required: true,
            options: ['City', 'Airport', 'Hotel', 'Other']
          },
          {
            id: 'service_for_airports',
            type: 'text',
            label: 'Service (for airports)',
            required: false
          },
          {
            id: 'pickup_instructions',
            type: 'textarea',
            label: 'Pick up instructions if service is Shuttle/Delivery/Meet&Greet',
            required: false
          },
          {
            id: 'address',
            type: 'text',
            label: 'Address',
            required: true
          },
          {
            id: 'zip',
            type: 'text',
            label: 'ZIP (numbers)',
            required: true
          },
          {
            id: 'city',
            type: 'text',
            label: 'City',
            required: true
          },
          {
            id: 'state',
            type: 'text',
            label: 'State',
            required: true
          },
          {
            id: 'country',
            type: 'text',
            label: 'Country',
            required: true
          },
          {
            id: 'latitude',
            type: 'number',
            label: 'Latitude',
            required: false
          },
          {
            id: 'longitude',
            type: 'number',
            label: 'Longitude',
            required: false
          },
          {
            id: 'land_line',
            type: 'text',
            label: 'Land Line (only numbers)',
            required: false
          },
          {
            id: 'location_email',
            type: 'email',
            label: "Location's Email",
            required: false
          },
          {
            id: 'mon_fri_hours',
            type: 'text',
            label: 'Mon-Fri Business Hours',
            required: true
          },
          {
            id: 'saturday_hours',
            type: 'text',
            label: 'Saturday Business Hours',
            required: true
          },
          {
            id: 'sunday_hours',
            type: 'text',
            label: 'Sunday Business Hours',
            required: true
          },
          {
            id: 'holiday_hours',
            type: 'text',
            label: 'Holiday Business Hours',
            required: true
          },
          {
            id: 'notes',
            type: 'textarea',
            label: 'Notes',
            required: false
          }
        ]
      },
      {
        title: 'Frota AZ',
        description: 'Informações sobre os veículos disponíveis',
        fields: [
          {
            id: 'acriss_sipp_code',
            type: 'text',
            label: 'ACRISS/SIPP CODE',
            required: true
          },
          {
            id: 'car_type',
            type: 'select',
            label: 'Car Type',
            required: true,
            options: ['Economy', 'Compact', 'Mid-size', 'Full-size', 'Premium', 'Luxury', 'SUV', 'Convertible']
          },
          {
            id: 'car_sample',
            type: 'text',
            label: 'Car Sample',
            required: true
          },
          {
            id: 'doors',
            type: 'number',
            label: 'Doors',
            required: true
          },
          {
            id: 'seats',
            type: 'number',
            label: 'Seats',
            required: true
          },
          {
            id: 'transmission',
            type: 'select',
            label: 'Transmission',
            required: true,
            options: ['Automatic', 'Manual']
          },
          {
            id: 'excess_amount',
            type: 'number',
            label: 'Excess Amount',
            required: true
          },
          {
            id: 'security_deposit',
            type: 'text',
            label: 'Security Deposit',
            required: true
          }
        ]
      },
      {
        title: 'Termos e Condições',
        description: 'Configurações de política e pagamento',
        fields: [
          {
            id: 'vat_percentage',
            type: 'number',
            label: 'VAT %',
            required: true
          },
          {
            id: 'government_tax',
            type: 'number',
            label: 'Government Tax',
            required: false
          },
          {
            id: 'premium_location',
            type: 'checkbox',
            label: 'Premium Location',
            required: false
          },
          {
            id: 'airport_access',
            type: 'checkbox',
            label: 'Airport Access',
            required: false
          },
          {
            id: 'fuel',
            type: 'text',
            label: 'Fuel Policy',
            required: false
          },
          {
            id: 'first_additional_driver',
            type: 'number',
            label: 'First Additional Driver Fee',
            required: false
          },
          {
            id: 'cash_accepted',
            type: 'checkbox',
            label: 'Cash accepted',
            required: false
          },
          {
            id: 'debit_cards',
            type: 'checkbox',
            label: 'Debit Cards',
            required: false
          },
          {
            id: 'credit_cards',
            type: 'checkbox',
            label: 'Credit cards',
            required: false
          },
          {
            id: 'master',
            type: 'checkbox',
            label: 'Master',
            required: false
          },
          {
            id: 'maestro',
            type: 'checkbox',
            label: 'Maestro',
            required: false
          },
          {
            id: 'visa',
            type: 'checkbox',
            label: 'Visa',
            required: false
          },
          {
            id: 'american_express',
            type: 'checkbox',
            label: 'American Express',
            required: false
          },
          {
            id: 'diners',
            type: 'checkbox',
            label: 'Diners',
            required: false
          },
          {
            id: 'deposit_amount',
            type: 'number',
            label: 'Deposit amount',
            required: false
          },
          {
            id: 'credit_card_main_driver',
            type: 'checkbox',
            label: 'Credit card should be under the main driver\'s name',
            required: false
          },
          {
            id: 'minimum_driver_age',
            type: 'number',
            label: 'Minimum driver age',
            required: true
          },
          {
            id: 'maximum_driver_age',
            type: 'number',
            label: 'Maximum driver age',
            required: false
          },
          {
            id: 'damage_rates',
            type: 'textarea',
            label: 'Damage Rates',
            required: false
          },
          {
            id: 'fuel_policy_details',
            type: 'textarea',
            label: 'Fuel Policy Details',
            required: false
          }
        ]
      }
    ]
  },
  {
    id: 'contact-info-only',
    name: 'Informações de Contato',
    description: 'Formulário simplificado para coleta de informações de contato',
    icon: 'Users',
    steps: [
      {
        title: 'Informações de Contato',
        description: 'Dados dos responsáveis pelos departamentos',
        fields: [
          {
            id: 'account_manager_email',
            type: 'email',
            label: 'Account Manager - Email',
            required: true
          },
          {
            id: 'account_manager_name',
            type: 'text',
            label: 'Account Manager - Nome',
            required: true
          },
          {
            id: 'customer_service_manager_email',
            type: 'email',
            label: 'Customer Service Manager - Email',
            required: true
          },
          {
            id: 'customer_service_manager_name',
            type: 'text',
            label: 'Customer Service Manager - Nome',
            required: true
          }
        ]
      }
    ]
  },
  {
    id: 'location-info',
    name: 'Informações da Localização',
    description: 'Formulário para coleta de dados de localização e serviços',
    icon: 'MapPin',
    steps: [
      {
        title: 'Informações da Localização',
        description: 'Detalhes sobre a localização e serviços',
        fields: [
          {
            id: 'web_service_code',
            type: 'text',
            label: 'Web Service Code',
            required: true
          },
          {
            id: 'type_of_store',
            type: 'select',
            label: 'Type of Store',
            required: true,
            options: ['City', 'Airport', 'Hotel', 'Other']
          },
          {
            id: 'address',
            type: 'text',
            label: 'Address',
            required: true
          },
          {
            id: 'city',
            type: 'text',
            label: 'City',
            required: true
          },
          {
            id: 'state',
            type: 'text',
            label: 'State',
            required: true
          },
          {
            id: 'country',
            type: 'text',
            label: 'Country',
            required: true
          }
        ]
      }
    ]
  },
  {
    id: 'blank-form',
    name: 'Formulário em Branco',
    description: 'Crie um formulário do zero, adicionando os campos que desejar',
    icon: 'Sparkles',
    steps: [
      {
        title: 'Etapa Inicial',
        description: 'Adicione os campos necessários para esta etapa',
        fields: []
      }
    ]
  }
];