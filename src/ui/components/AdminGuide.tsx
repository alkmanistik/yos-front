const AdminGuide = () => {
    return (
        <div className="p-6 md:p-8 prose prose-sm max-w-none">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Руководство администратора</h1>
                <p className="text-gray-500">Для модераторов и администраторов мультисервиса «Yos»</p>
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 text-sm text-blue-700">
                    Для доступа к админ-панели необходимо иметь учётную запись с ролью «администратор».
                </div>
            </div>

            <div className="space-y-8">
                {adminSections.map((section, idx) => (
                    <div key={idx} id={`admin-section-${idx}`} className="scroll-mt-20">
                        <h2 className="text-xl font-semibold text-gray-900 border-l-4 border-red-500 pl-3 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4 text-gray-700">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const adminSections = [
    {
        title: '1. Вход в админ-панель',
        content: (
            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                <li>Авторизуйтесь в мультисервисе «Yos» как обычно</li>
                <li>Нажмите на своё имя или аватар в правом верхнем углу</li>
                <li>В выпадающем меню выберите пункт «Админ-панель»</li>
            </ol>
        )
    },
    {
        title: '2. Общие принципы работы',
        content: (
            <div className="space-y-3">
                <p>Все действия администратора фиксируются в системе. Все списки поддерживают:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Поиск по ключевым словам</li>
                    <li>Сортировку по дате, статусу, количеству жалоб</li>
                    <li>Пагинацию (постраничный вывод)</li>
                </ul>
                <div className="bg-red-50 p-3 rounded-lg">
                    <p className="font-medium text-red-800 mb-2">Основные правила модерации:</p>
                    <ul className="list-disc list-inside text-sm text-red-700">
                        <li>Недопустимый контент: оскорбления, нецензурная лексика, призывы к насилию, порнография, спам</li>
                        <li>Запрещены товары, нарушающие законодательство</li>
                        <li>Рекламные советы разрешены только от верифицированных рекламодателей</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        title: '3. Модерация желаний',
        content: (
            <div className="space-y-3">
                <p><strong>Как найти желания для проверки:</strong> Раздел «Желания» в админ-панели. Доступны фильтры по статусу и дате.</p>
                <p><strong>Доступные действия с желанием:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Оставить как есть</li>
                    <li>Скрыть — желание перестаёт отображаться для всех пользователей</li>
                    <li>Удалить — полное удаление без возможности восстановления</li>
                    <li>Заблокировать автора</li>
                </ul>
            </div>
        )
    },
    {
        title: '4. Модерация советов',
        content: (
            <div className="space-y-3">
                <p><strong>Как найти советы для проверки:</strong> Раздел «Советы» в админ-панели. Рекламные советы отмечены маркером «Реклама».</p>
                <p><strong>Особенности модерации рекламных советов:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Может быть отклонён, если не соответствует категории</li>
                    <li>При недостоверной информации — скрыть и направить жалобу</li>
                    <li>При повторных нарушениях — блокировка аккаунта</li>
                </ul>
            </div>
        )
    },
    {
        title: '5. Управление пользователями',
        content: (
            <div className="space-y-3">
                <p><strong>Поиск пользователя:</strong> Раздел «Пользователи» — по имени, email или ID.</p>
                <p><strong>Доступные действия:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Отправить предупреждение</li>
                    <li>Заблокировать / Разблокировать</li>
                    <li>Удалить пользователя (только в крайних случаях)</li>
                </ul>
                <p><strong>Причины для блокировки:</strong> неоднократное создание недопустимого контента, грубые оскорбления, мошенничество.</p>
            </div>
        )
    },
    {
        title: '6. Работа с жалобами',
        content: (
            <div className="space-y-3">
                <p>Жалобы автоматически попадают в раздел «Жалобы» админ-панели.</p>
                <p><strong>Рекомендуемый срок обработки жалобы:</strong> не более 24 часов в рабочие дни.</p>
                <p><strong>Варианты решений:</strong> отклонить жалобу, скрыть/удалить контент, заблокировать автора.</p>
            </div>
        )
    },
    {
        title: '7. Логирование действий',
        content: (
            <div className="space-y-3">
                <p>Все действия администратора фиксируются в системе. Логи хранятся не менее 90 дней.</p>
                <p><strong>Что фиксируется:</strong> дата и время, администратор, тип действия, объект действия.</p>
                <p>Просмотреть логи можно в разделе «Логи действий» админ-панели.</p>
            </div>
        )
    },
    {
        title: '8. Часто задаваемые вопросы (FAQ)',
        content: (
            <div className="space-y-3">
                <p><strong>Как долго рассматривается жалоба?</strong> Рекомендованный срок — 24 часа.</p>
                <p><strong>Может ли администратор видеть приватные желания пользователей?</strong> Нет.</p>
                <p><strong>Блокируется ли пользователь автоматически после нескольких жалоб?</strong> Нет, решение принимает администратор вручную.</p>
            </div>
        )
    }
];

export default AdminGuide;