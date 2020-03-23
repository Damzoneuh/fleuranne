<?php


namespace App\Helper;


use Symfony\Bridge\Twig\Mime\TemplatedEmail;

trait Mailer
{
   public function createTemplatedMessage($email, $text, $phone, $name){
       $message = new TemplatedEmail();
       $message->to('fleuranne@bbox.fr');
       $message->subject('Formulaire de contact fleuranne');
       $message->from('contact@fleuranne.fr');
       $message->htmlTemplate('mailer/index.html.twig');
       $message->context(['name' => $name, 'message' => $text, 'phone' => $phone, 'mail' => $email]);

       return $message;
   }

   public function verifyEmail($email){
       if (filter_var($email, FILTER_VALIDATE_EMAIL)){
           return true;
       }
       return false;
   }
}