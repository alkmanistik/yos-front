const UserGuide = () => {
    return (
        <div className="p-6 md:p-8 prose prose-sm max-w-none">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Руководство пользователя</h1>
                <p className="text-gray-500">Yos (Your Something) — мультисервис для персональной организации и социального шопинга.</p>
            </div>

            {/* Содержание */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Содержание</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {sections.map((section, idx) => (
                        <a key={idx} href={`#section-${idx}`} className="text-blue-600 hover:text-blue-800 text-sm">
                            {section.title}
                        </a>
                    ))}
                </div>
            </div>

            {/* Разделы */}
            {sections.map((section, idx) => (
                <div key={idx} id={`section-${idx}`} className="mb-8 scroll-mt-20">
                    <h2 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-3 mb-4">
                        {section.title}
                    </h2>
                    <div className="space-y-4 text-gray-700">
                        {section.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

const sections = [
    {
        title: '1. Регистрация и авторизация',
        content: (
            <div className="space-y-3">
                <div>
                    <h3 className="font-medium text-gray-900 mb-2">Регистрация нового пользователя</h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                        <li>Откройте главную страницу сервиса</li>
                        <li>Нажмите кнопку «Войти» в правом верхнем углу</li>
                        <li>Перейдите по ссылке «Зарегистрироваться»</li>
                        <li>Заполните поля: имя, электронная почта, пароль</li>
                        <li>Нажмите «Зарегистрироваться»</li>
                    </ol>
                </div>
                <div>
                    <h3 className="font-medium text-gray-900 mb-2">Вход в существующий аккаунт</h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                        <li>Нажмите кнопку «Войти»</li>
                        <li>Введите электронную почту и пароль</li>
                        <li>Нажмите «Войти»</li>
                    </ol>
                </div>
            </div>
        )
    },
    {
        title: '2. Профиль пользователя',
        content: (
            <div className="space-y-3">
                <p><strong>Просмотр и редактирование профиля:</strong> Нажмите на своё имя или аватар → «Мой профиль» → «Редактировать».</p>
                <p><strong>Настройки приватности:</strong> В разделе «Настройки» вы можете выбрать, кто может бронировать ваши желания: все пользователи или только друзья.</p>
            </div>
        )
    },
    {
        title: '3. Список желаний (Вишлист)',
        content: (
            <div className="space-y-3">
                <div>
                    <h3 className="font-medium text-gray-900 mb-2">Создание желания</h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                        <li>Перейдите в раздел «Желания»</li>
                        <li>Нажмите кнопку «Добавить желание»</li>
                        <li>Заполните форму (изображение, название, описание, цена, ссылка)</li>
                        <li>При необходимости поставьте галочку «Скрыть от других»</li>
                        <li>Нажмите «Сохранить»</li>
                    </ol>
                </div>
                <p><strong>Исполнение желания:</strong> Откройте желание → нажмите «Исполнено».</p>
            </div>
        )
    },
    {
        title: '4. Советы',
        content: (
            <div className="space-y-3">
                <p>Совет — это публикация с рекомендацией товара. Вы можете поделиться своим мнением, приложить фотографии и дать ссылку на товар.</p>
                <p><strong>Взаимодействие с советами:</strong> Лайки, комментарии, сохранение в желания, жалоба.</p>
                <p><strong>Поиск советов:</strong> На странице «Советы» есть строка поиска и фильтры по категориям.</p>
            </div>
        )
    },
    {
        title: '5. Подписки и друзья',
        content: (
            <div className="space-y-3">
                <p><strong>Подписка на пользователя:</strong> Зайдите в профиль пользователя → нажмите «Подписаться».</p>
                <p><strong>Друзья:</strong> Если пользователь также подпишется на вас в ответ — вы станете друзьями.</p>
                <p><strong>Просмотр подписок:</strong> В своём профиле в разделе «Подписки».</p>
            </div>
        )
    },
    {
        title: '6. Органайзер подписок',
        content: (
            <div className="space-y-3">
                <p>Инструмент для учёта ваших платных подписок. Сервис поможет посчитать, сколько вы тратите на подписки в месяц и в год.</p>
                <p><strong>Добавление подписки:</strong> «Органайзер» → «Подписки» → «Добавить подписку».</p>
            </div>
        )
    },
    {
        title: '7. Хранилище чеков',
        content: (
            <div className="space-y-3">
                <p>Функция позволяет хранить чеки о покупках и отслеживать гарантийные сроки.</p>
                <p><strong>Добавление чека:</strong> «Органайзер» → «Чеки» → «Добавить чек».</p>
                <p className="text-sm text-gray-500">Система пришлёт уведомление, когда до окончания гарантии останется 7 дней.</p>
            </div>
        )
    },
    {
        title: '8. Рекламные партнёры',
        content: (
            <div className="space-y-3">
                <p><strong>Как стать партнёром:</strong> Раздел «Помощь» → оставьте заявку на почту.</p>
                <p><strong>Статистика:</strong> В личном кабинете рекламодателя доступны просмотры, клики, расход средств.</p>
            </div>
        )
    },
    {
        title: '9. Часто задаваемые вопросы (FAQ)',
        content: (
            <div className="space-y-3">
                <p><strong>Обязательно ли регистрироваться?</strong> Для просмотра публичного контента — нет, для создания контента — да.</p>
                <p><strong>Могу ли я удалить свой аккаунт?</strong> Да, в настройках профиля.</p>
                <p><strong>Кто видит мои желания?</strong> Все пользователи, если вы не скрыли их.</p>
            </div>
        )
    },
    {
        title: '10. Контакты службы поддержки',
        content: (
            <div className="space-y-3">
                <p>📧 <strong>Email:</strong> support@yos.ru</p>
                <p>💬 <strong>Раздел «Помощь»</strong> в самом сервисе (форма обратной связи)</p>
                <p className="text-sm text-gray-500">Мы стараемся отвечать в течение 24 часов в рабочие дни.</p>
            </div>
        )
    }
];

export default UserGuide;