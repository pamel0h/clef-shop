<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class RequiredFieldsGroup implements Rule
{
    protected $fields;
    protected $errorMessage;

    public function __construct(array $fields, string $errorMessage)
    {
        $this->fields = $fields;
        $this->errorMessage = $errorMessage;
    }

    public function passes($attribute, $value)
    {
        // Проверяем, что все указанные поля заполнены
        foreach ($this->fields as $field) {
            $fieldValue = data_get($value, $field);
            if (is_null($fieldValue) || trim($fieldValue) === '') {
                return false;
            }
        }
        return true;
    }

    public function message()
    {
        return $this->errorMessage;
    }
}