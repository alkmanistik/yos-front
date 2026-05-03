const ModeratorInstructions = () => {
    return (
        <div className="p-6 md:p-8 prose prose-sm max-w-none">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Должностные инструкции модераторов контента</h1>
                <p className="text-gray-500">Версия 1.0 | Утверждено руководителем отдела</p>
            </div>

            <div className="space-y-8">
                {/* 1. Общие положения */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 border-l-4 border-green-500 pl-3 mb-4">1. Общие положения</h2>
                    <div className="space-y-3 text-gray-700">
                        <p>1.1. Модератор контента назначается на должность и освобождается от должности руководителем отдела.</p>
                        <p>1.2. Модератор подчиняется руководителю отдела / старшему администратору.</p>
                        <p>1.3. Модератор должен знать:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>правила платформы (что можно публиковать, что нельзя)</li>
                            <li>интерфейс админ-панели мультисервиса «Yos»</li>
                            <li>порядок обработки жалоб</li>
                            <li>сроки реакции на нарушения</li>
                        </ul>
                    </div>
                </div>

                {/* 2. Должностные обязанности */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 border-l-4 border-green-500 pl-3 mb-4">2. Должностные обязанности</h2>
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <p className="font-medium">2.1. Проверка публичного контента</p>
                            <ul className="list-disc list-inside ml-4 mt-1">
                                <li>Просматривать желания и советы, опубликованные пользователями</li>
                                <li>Выявлять контент, нарушающий правила</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium">2.2. Обработка жалоб</p>
                            <ul className="list-disc list-inside ml-4 mt-1">
                                <li>Принимать к рассмотрению жалобы от пользователей</li>
                                <li>Принимать решение по каждой жалобе в течение 24 часов</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium">2.3. Применение мер к нарушителям</p>
                            <ul className="list-disc list-inside ml-4 mt-1">
                                <li>Скрывать или удалять контент, нарушающий правила</li>
                                <li>Отправлять пользователям предупреждения</li>
                                <li>Блокировать пользователей при повторных или грубых нарушениях</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 3. Права */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 border-l-4 border-green-500 pl-3 mb-4">3. Права</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Получать доступ к админ-панели мультисервиса «Yos»</li>
                        <li>Скрывать и удалять контент, нарушающий правила</li>
                        <li>Отправлять предупреждения пользователям</li>
                        <li>Блокировать и разблокировать пользователей</li>
                        <li>Отклонять жалобы, если контент не нарушает правила</li>
                        <li>Запрашивать разъяснения у старшего администратора</li>
                        <li>Предлагать улучшения в правилах модерации или интерфейсе админ-панели</li>
                    </ul>
                </div>

                {/* 4. Ответственность */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 border-l-4 border-green-500 pl-3 mb-4">4. Ответственность</h2>
                    <div className="space-y-3 text-gray-700">
                        <p>Модератор несёт ответственность за:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Качество модерации — пропуск явных нарушений правил</li>
                            <li>Своевременность — нарушение сроков обработки жалоб</li>
                            <li>Обоснованность решений — необоснованное скрытие контента или блокировка</li>
                            <li>Конфиденциальность — разглашение информации о действиях модерации</li>
                        </ul>
                        <div className="bg-gray-50 p-3 rounded-lg mt-3">
                            <p className="font-medium">Виды ответственности:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                <li>Замечание — при незначительных ошибках</li>
                                <li>Отстранение от модерации — при повторных ошибках</li>
                                <li>Лишение доступа к админ-панели — при грубых нарушениях</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 5. Порядок действий при нарушении */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 border-l-4 border-green-500 pl-3 mb-4">5. Порядок действий при нарушении</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Ситуация</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Действие модератора</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            <tr><td className="px-4 py-3 text-sm">Явное нарушение (оскорбления, запрещённый товар)</td><td className="px-4 py-3 text-sm">Скрыть контент + отправить предупреждение автору</td></tr>
                            <tr><td className="px-4 py-3 text-sm">Грубое или повторное нарушение</td><td className="px-4 py-3 text-sm">Удалить контент + заблокировать пользователя</td></tr>
                            <tr><td className="px-4 py-3 text-sm">Реклама: незначительное нарушение</td><td className="px-4 py-3 text-sm">Уведомить рекламодателя, дать 24 часа на исправление</td></tr>
                            <tr><td className="px-4 py-3 text-sm">Реклама: недостоверная информация</td><td className="px-4 py-3 text-sm">Скрыть совет, уведомить отдел по работе с партнёрами</td></tr>
                            <tr><td className="px-4 py-3 text-sm">Реклама: повторное нарушение</td><td className="px-4 py-3 text-sm">Заблокировать рекламный аккаунт</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModeratorInstructions;