<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class RequiredFieldsGroup implements Rule
{
    protected $fields;
    protected $errorMessage;
    protected $allowEmpty;

    public function __construct(array $fields, string $errorMessage, bool $allowEmpty = false)
    {
        $this->fields = $fields;
        $this->errorMessage = $errorMessage;
        $this->allowEmpty = $allowEmpty;
    }

    public function passes($attribute, $value)
    {
        $hasAnyFilled = false;
        $allEmpty = true;

        // Проверяем, заполнено ли хотя бы одно поле
        foreach ($this->fields as $field) {
            $fieldValue = data_get($value, $field);
            if (!is_null($fieldValue) && trim($fieldValue) !== '') {
                $hasAnyFilled = true;
                $allEmpty = false;
            } elseif ($allEmpty && (is_null($fieldValue) || trim($fieldValue) === '')) {
                // Если поле пустое, продолжаем считать все поля пустыми
                continue;
            } else {
                $allEmpty = false;
            }
        }

        // Если allowEmpty = true и все поля пустые, валидация проходит
        if ($this->allowEmpty && $allEmpty) {
            return true;
        }

        // Если хотя бы одно поле заполнено, все поля должны быть заполнены
        if ($hasAnyFilled) {
            foreach ($this->fields as $field) {
                $fieldValue = data_get($value, $field);
                if (is_null($fieldValue) || trim($fieldValue) === '') {
                    return false;
                }
            }
        }

        return true;
    }

    public function message()
    {
        return $this->errorMessage;
    }
}