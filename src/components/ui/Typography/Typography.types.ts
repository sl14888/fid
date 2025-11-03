import { ReactNode, ElementType, HTMLAttributes } from 'react';

/**
 * Все доступные варианты типографики
 */
export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'textLRegular'
  | 'textLMedium'
  | 'textMRegular'
  | 'textMMedium'
  | 'textS'
  | 'textXs'
  | 'labelM'
  | 'labelS'
  | 'labelXs';

/**
 * Маппинг вариантов на CSS классы
 */
export const variantClassMap: Record<TypographyVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  textLRegular: 'textLRegular',
  textLMedium: 'textLMedium',
  textMRegular: 'textMRegular',
  textMMedium: 'textMMedium',
  textS: 'textS',
  textXs: 'textXs',
  labelM: 'labelM',
  labelS: 'labelS',
  labelXs: 'labelXs',
};

/**
 * Маппинг вариантов на HTML теги по умолчанию
 */
export const variantTagMap: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  textLRegular: 'p',
  textLMedium: 'p',
  textMRegular: 'p',
  textMMedium: 'p',
  textS: 'p',
  textXs: 'p',
  labelM: 'span',
  labelS: 'span',
  labelXs: 'span',
};

/**
 * Props для основного компонента Typography
 */
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /**
   * Вариант типографики
   */
  variant: TypographyVariant;

  /**
   * Содержимое компонента
   */
  children: ReactNode;

  /**
   * Дополнительные CSS классы
   */
  className?: string;

  /**
   * HTML тег для рендера (например: 'h1', 'p', 'span', 'div')
   * Если не указан, будет использован тег по умолчанию для данного варианта
   */
  tag?: ElementType;

  /**
   * Цвет текста (любое CSS значение: '#fff', 'rgb(255,0,0)', 'var(--color-primary)')
   */
  color?: string;
}

/**
 * Props для компонентов-алиасов (без variant, так как он предустановлен)
 */
export type AliasTypographyProps = Omit<TypographyProps, 'variant'>;
