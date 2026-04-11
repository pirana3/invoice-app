import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSavedLanguage, saveLanguage } from '@/database/appstate';

type Language = 'en' | 'es';

type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const translations = {
  en: {
    choose_language_title: 'Please choose a language',
    english: 'English',
    spanish: 'Spanish',
    continue: 'Continue',
    business_title_new: 'Please enter your company details',
    business_title_edit: 'Edit your company details',
    business_name: 'Company Name',
    business_email: 'Company Email',
    business_phone: 'Phone Number',
    business_address: 'Address',
    business_industry: 'Industry',
    business_photo_upload: 'Upload Business Photo (Optional)',
    business_photo_change: 'Change Business Photo',
    business_photo_remove: 'Remove Photo',
    business_save_info: 'Save Info',
    business_save_changes: 'Save Changes',
    business_loading: 'Loading...',
    business_missing_name: 'Please enter your company name.',
    business_missing_email: 'Please enter your company email.',
    business_invalid_phone: 'Please enter a valid phone number.',
    business_missing_address: 'Please enter your company address.',
    business_missing_industry: 'Please enter your company industry.',
    business_save_failed: 'Could not save business info.',
    business_permission_needed: 'Permission needed',
    business_permission_message: 'Please allow photo library access to choose a logo.',
    business_index: 'Loading...',
    business_cant_load: 'Could not load business info.',
    business_info: 'Business Info',
    business_info_not_saved: 'No business information saved yet.',
    add_product: 'Add Product',
    no_products: 'No Products yet',
    invoice_client_missing: 'Missing cleint, Please enter a client name.',
    invoice_number_invalid: 'Invalid invoice number, Please enter a valid number.',
    invoice_date_invalid: 'Invalid invoice date, Please enter a valid date.',
    invoice_total_invalid: 'Invalid total, Please enter a valid total.',
    invoice_saved: 'Invovice Saved',
    invoice_fail_save: 'Invoice did not save properly, Could not save the invoice',
    invoice_no_pdf: 'No Invoice, Generate Invoice first.',
    invoice_no_save_pdf: 'Saved failed, Could not save Invoice',
    invoice_shared_failed: 'Share failed, Sharing is not available on this device',
    invoice_print_failed: ' Print failed, Could not print the Invoice',


  },
  es: {
    choose_language_title: 'Por favor, elija un idioma',
    english: 'Ingles',
    spanish: 'Espanol',
    continue: 'Continuar',
    business_title_new: 'Por favor ingrese los datos de su empresa',
    business_title_edit: 'Editar los datos de su empresa',
    business_name: 'Nombre de la empresa',
    business_email: 'Correo de la empresa',
    business_phone: 'Numero de telefono',
    business_address: 'Direccion',
    business_industry: 'Industria',
    business_photo_upload: 'Subir foto de la empresa (Opcional)',
    business_photo_change: 'Cambiar foto de la empresa',
    business_photo_remove: 'Eliminar foto',
    business_save_info: 'Guardar',
    business_save_changes: 'Guardar cambios',
    business_loading: 'Cargando...',
    business_missing_name: 'Por favor ingrese el nombre de la empresa.',
    business_missing_email: 'Por favor ingrese el correo de la empresa.',
    business_invalid_phone: 'Por favor ingrese un numero de telefono valido.',
    business_missing_address: 'Por favor ingrese la direccion de la empresa.',
    business_missing_industry: 'Por favor ingrese la industria de la empresa.',
    business_save_failed: 'No se pudo guardar la informacion.',
    business_permission_needed: 'Se necesita permiso',
    business_permission_message: 'Permita acceso a la galeria para elegir un logo.',
    business_index: 'Cargando...',
    business_cant_load: 'No se pudo cargar la informacion de la empresa.',
    business_info: 'Informacion de la empresa',
    business_info_not_saved: 'No hay informacion de la empresa guardada.',
    add_product: 'Agregar producto',
    no_products: 'No hay productos aun',
    invoice_client_missing: 'Falta el clientes nombre, por favor ingrese un nombre de cliente.',
    invoice_number_invalid: 'Numero de factura invalido, Por favor ingrese un numero valido.',
    invoice_date_invalid: 'Fecha de factura invalida, Por favor ingrese una fecha valida.',
    invoice_total_invalid: 'Total invalido, Por favor ingrese un total valido.',
    invoice_saved: 'Invoice Guardado',
    invoice_fail_save: 'Invoice no se guardo, No se pudo guardar el Invoice.',
    invoice_no_pdf: 'No PDF, Generar el Invoice primero.',
    invoice_no_save_pdf: 'Error al guardar, No se pudo guardar el Invoice',
    invoice_shared_failed: 'Error al compartir, No se pudo compatir el Invoice',
    invoice_print_failed: 'Imprimir fallo, No se Pudo Iimprimir el Invoice'

  },
} as const;

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const saved = await getSavedLanguage();
      if (saved) {
        setLanguageState(saved);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    void saveLanguage(nextLanguage);
  };

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key],
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};
