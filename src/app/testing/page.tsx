'use client'

import { useEffect, useState } from 'react'
import { Badge, BadgeVariant } from '@/components/ui/Badge'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { SearchInput } from '@/components/ui/SearchInput'
import { Switch } from '@/components/ui/Switch'
import { TextArea } from '@/components/ui/TextArea'
import {
  Heading1,
  TextLMedium,
  TextLRegular,
  TextS,
} from '@/components/ui/Typography'
import { Rating, RatingSize } from '@/components/ui/Rating'
import { Pagination } from '@/components/ui/Pagination'
import { Avatar, AvatarSize, AvatarColor } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { SmallCompanyCard } from '@/components/SmallCompanyCard/SmallCompanyCard'
import { Modal } from '@/components/ui/Modal'
import { ReviewCard } from '@/components/ReviewCard'
import type { FeedbackDto } from '@/types/feedback.types'
import { CompanyListItem } from '@/components/CompanyListItem'
import { CompanyCard } from '@/components/CompanyCard'
import { UserListItem } from '@/components/UserListItem'
import { showToast } from '@/lib/utils/toast-utils'
import toast from 'react-hot-toast'

export default function Testing() {
  const [isSwitch, setIsSwitch] = useState(false)
  const [rating1, setRating1] = useState(0)
  const [currentPage, setCurrentPage] = useState(7)

  const [selectedCountry, setSelectedCountry] = useState<string | number>('')
  const [selectedCity, setSelectedCity] = useState<string | number>('')

  const [modalOpen, setModalOpen] = useState(false)

  // Мок данные для ReviewCard
  const mockReviewUser: FeedbackDto = {
    id: 1,
    title: 'Пахнет тухлым и хлоркой',
    grade: 1,
    pluses:
      'Продуктовый магазин предлагает дружелюбный и внимательный персонал, широкий ассортимент свежих продуктов и удобное местоположение, что делает покупки комфортными и приятными.',
    minuses:
      'Иногда не хватает свежих овощей. Порой очередь на кассе слишком длинная.',
    description:
      'Недавно посетил магазин "Пятерочку" и остался в шоке. Ассортимент впечатляет: свежие продукты и экзотические фрукты, особенно местные сыры. Но цены высокие, и не всегда товары свежие. В час пик многолюдно, что создаёт неудобства. В целом, это место для гурманов, но не для экономии. Рекомендую любителям качественных продуктов, готовым платить больше.',
    userName: 'Владимир',
    userEmail: 'vladimir@example.com',
    createdTime: '2025-05-05T10:30:00.000Z',
    onView: true,
  }

  const mockReviewCompany: FeedbackDto = {
    id: 2,
    title: 'Для магазина у дома – ok, необходимое есть',
    grade: 3,
    pluses:
      'Продуктовый магазин предлагает дружелюбный и внимательный персонал, широкий ассортимент свежих продуктов и удобное местоположение, что делает покупки комфортными и приятными.',
    minuses:
      'Иногда не хватает свежих овощей. Порой очередь на кассе слишком длинная.',
    description:
      'Недавно посетил "Пятерочку" и остался с противоречивыми впечатлениями. С одной стороны, ассортимент просто потрясающий: свежие продукты, экзотические фрукты и деликатесы, которые не найдёшь в обычных супермаркетах. Особенно порадовали местные сыры. Но цены высокие, и не всегда товары свежие. В час пик многолюдно, что создаёт неудобства. В целом, это место для гурманов.',
    companyName: 'Пятерочка',
    companyAverageGrade: 4.8,
    companyCountFeedbacks: 256,
    userName: 'Мария Сидорова',
    userEmail: 'maria@example.com',
    createdTime: '2025-04-02T14:00:00.000Z',
    onView: true,
  }

  return (
    <section>
      <div>Тестовые Toast уведомления</div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <Button
          text="Success Toast"
          variant={ButtonVariant.Primary}
          size={ButtonSize.Small}
          onClick={() => showToast.success('Операция выполнена успешно!')}
        />
        <Button
          text="Error Toast"
          variant={ButtonVariant.PrimaryBlack}
          size={ButtonSize.Small}
          onClick={() => showToast.error('Произошла ошибка при выполнении операции')}
        />
        <Button
          text="Warning Toast"
          variant={ButtonVariant.SecondaryGray}
          size={ButtonSize.Small}
          onClick={() => showToast.warning('Внимание! Проверьте введённые данные')}
        />
        <Button
          text="Info Toast"
          variant={ButtonVariant.PrimaryInverse}
          size={ButtonSize.Small}
          onClick={() => showToast.info('Информационное сообщение для вас')}
        />
        <Button
          text="Loading Toast"
          variant={ButtonVariant.SecondaryGray}
          size={ButtonSize.Small}
          onClick={() => {
            const id = showToast.loading('Загрузка данных...');
            setTimeout(() => showToast.dismiss(id), 3000);
          }}
        />
        <Button
          text="Promise Toast"
          variant={ButtonVariant.Primary}
          size={ButtonSize.Small}
          onClick={() => {
            const promise = new Promise((resolve) =>
              setTimeout(() => resolve('Готово!'), 2000)
            );
            showToast.promise(promise, {
              loading: 'Загрузка...',
              success: 'Данные загружены успешно!',
              error: 'Ошибка загрузки',
            });
          }}
        />
      </div>

      <div>Тетовые иконки</div>
      <Icon name={IconName.ArrowDown} size={IconSize.Large} />
      <Icon name={IconName.List} size={IconSize.Large} color="blue" />
      <Icon name={IconName.PersonOutline} size={IconSize.Small} color="red" />
      <div>Тетовая типографика</div>
      <Heading1>Тест Heading 1</Heading1>
      <TextLRegular>Тест TextLRegular</TextLRegular>
      <TextLMedium>Тест TextLMedium</TextLMedium>
      <TextS>Тест TextS</TextS>
      <div>Тетовые кнопки</div>

      <div>
        <Button
          text="Кнопка Primary"
          variant={ButtonVariant.Primary}
          iconLeft={<Icon name={IconName.Earth} />}
          onClick={() => setModalOpen(!modalOpen)}
        />
        <Button
          text="Кнопка SecondaryBlue"
          variant={ButtonVariant.PrimaryInverse}
          iconLeft={<Icon name={IconName.Earth} />}
        />
        <Button
          text="Кнопка PrimaryBlack маленькая "
          variant={ButtonVariant.PrimaryBlack}
          size={ButtonSize.Small}
          iconLeft={<Icon name={IconName.Earth} size={IconSize.Small} />}
        />
        <Button
          text="Кнопка SecondaryGray маленькая "
          variant={ButtonVariant.SecondaryGray}
          size={ButtonSize.Small}
          iconLeft={<Icon name={IconName.Earth} size={IconSize.Small} />}
        />

        <div>Тестовые инпуты</div>
        <div>
          <Input
            label="Email"
            type="email"
            helperText="Введите ваш email"
            error="Тестовая ошибка"
          />

          <SearchInput placeholder="Поиск компаний" />

          <TextArea
            label="Отзыв"
            maxLength={500}
            showCounter
            helperText="Напишите ваш отзыв"
          />
        </div>

        <div>Тестовые Switch</div>
        <Switch
          label="Включить уведомления"
          checked={isSwitch}
          onChange={() => setIsSwitch(!isSwitch)}
        />

        <div>Тестовые Badge</div>
        <Badge text="Primary" variant={BadgeVariant.Primary} />
      </div>
      <div>
        <div>Интерактивный рейтинг</div>
        <div>
          <Rating
            value={rating1}
            onChange={setRating1}
            size={RatingSize.Large}
          />
        </div>
      </div>

      <div>
        <div>Пагинация</div>
        <Pagination
          currentPage={currentPage}
          totalPages={20}
          onPageChange={setCurrentPage}
          visiblePages={4}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div>Аватар</div>
        <Avatar
          size={AvatarSize.XS}
          initials="ДК"
          color={AvatarColor.Primary}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '20px' }}>Dropdown - базовый</div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Dropdown
            triggerText="Город"
            title="Выберите город"
            options={[
              { value: 'msk', label: 'Москва' },
              { value: 'spb', label: 'Санкт-Петербург' },
              { value: 'vvvv', label: 'Новосибирск' },
              { value: 'sadasdvvv', label: 'Екатеринбург' },
            ]}
            value={selectedCity}
            onChange={setSelectedCity}
          />

          <Dropdown
            triggerText="Филиал"
            title="Выберите филиал"
            options={[
              { value: 'hq', label: 'Головной офис' },
              { value: 'branch1', label: 'Филиал №1' },
              { value: 'branch2', label: 'Филиал №2' },
            ]}
            value={selectedCountry}
            onChange={setSelectedCountry}
          />
        </div>
      </div>

      <div>
        <div>Карточки</div>

        <div>
          <SmallCompanyCard
            companyName="Пятерочка"
            rating={4.8}
            logoUrl="https://buninave.ru/wp-content/uploads/2018/05/logo_5ka.png"
          />
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '20px' }}>ReviewCard - вариант User</div>
        <ReviewCard
          variant="user"
          feedback={mockReviewUser}
          onReadMore={() => console.log('Читать полностью - User')}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          ReviewCard - вариант Company (с логотипом)
        </div>
        <ReviewCard
          variant="company"
          feedback={mockReviewCompany}
          logoUrl="https://buninave.ru/wp-content/uploads/2018/05/logo_5ka.png"
          onReadMore={() => console.log('Читать полностью - Company')}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          ReviewCard - Loading Skeleton
        </div>
        <ReviewCard variant="user" feedback={mockReviewUser} loading={true} />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '20px' }}>CompanyListItem</div>
        <CompanyListItem
          displayName="Пятерочка"
          description="Магазин продуктов"
          logoUrl="https://buninave.ru/wp-content/uploads/2018/05/logo_5ka.png"
          companyAverageGrade={4.9}
          companyCountFeedbacks={9732}
        />
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          CompanyListItem - Loading Skeleton
        </div>
        <CompanyListItem
          displayName="Пятерочка"
          description="Магазин продуктов"
          logoUrl="https://buninave.ru/wp-content/uploads/2018/05/logo_5ka.png"
          companyAverageGrade={4.9}
          companyCountFeedbacks={9732}
          loading={true}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '20px' }}>CompanyCard</div>
        <CompanyCard
          name="Пятерочка"
          employmentType={{ id: 1, description: 'Магазин продуктов' }}
          averageGrade={4.9}
          inn={1234567890}
          logoUrl="https://buninave.ru/wp-content/uploads/2018/05/logo_5ka.png"
          website="https://www.5ka.ru"
          onReviewClick={() => console.log('Оставить отзыв')}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '20px' }}>UserListItem</div>
        <UserListItem
          name="Владимир"
          phone="442 112 555"
          email="liza412@gmail.com"
          countFeedbacks={5742}
          onClick={() => console.log('User clicked')}
          fluid
        />
      </div>

      <Modal
        title="Тестовый заголовок"
        isOpen={modalOpen}
        onClose={() => setModalOpen(!modalOpen)}
      >
        <div>Тестовый контент</div>
        <div>Тестовый контент</div>
        <div>Тестовый контент</div>
        <div>Тестовый контент</div>
      </Modal>
    </section>
  )
}
